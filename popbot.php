<?php

namespace popbot;

/**
 * Plugin Name:       PopBot
 * Description:       Convert your users with targeted pop-ups. Use triggers & rules to nudge your users towards conversions when they're ready using the perfect pop-up.
 * Version:           1.0.0
 * Requires at least: 5.2
 * Requires PHP:      7.4.0
 * Author:            Web Results Direct
 * Author URI:        https://wrd.studio.com/
 * License:           GPL v3 or later
 * License URI:       https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain:       popbot
 * Domain Path:       /languages
 */

class popbotPlugin
{
    const PLUGIN_FILE  = __FILE__;
    const VERSION = '1.0.1';
    const PLUGIN_DIR = WP_PLUGIN_DIR . '/popbot';
    const PLUGIN_URL = WP_PLUGIN_URL . '/popbot';

    const SESSION_LENGTH_IN_SECONDS = 1800; // 30 minutes

    const POST_TYPE = "popbot";
    const TAGS_TAXONOMY = "popbot_tag";
    const CUSTOM_CONDITIONS_POST_TYPE = "popbot_condition";
    const CAPABILITY = "manage_options";

    // wp-content uploads folder
    const CONTENT_DIR = WP_CONTENT_DIR . '/popbot';
    const CONTENT_URL = WP_CONTENT_URL . '/popbot';

    // Uploaded templates go here
    const TEMPLATES_UPLOADS_DIR = self::CONTENT_DIR . '/templates';

    // Built in templates
    const TEMPLATES_PLUGIN_DIR = self::PLUGIN_DIR . '/templates';

    // Options related to popBot.
    const OPTIONS_WHITELIST = [
        "popbot_version" => false,
        "popbot_license" => "",
        "popbot_pro" => false,

        "popbot_config_timeBetweenPopups" => 5000,
        "popbot_config_allowReshow" => true,
    ];

    /**
     * Sets up all hooks, creates admin pages and includes other required classes for PopBot to run.
     * 
     * @return void
     * 
     */
    static function init()
    {
        require_once popbotPlugin::PLUGIN_DIR . '/src/page.class.php';
        require_once popbotPlugin::PLUGIN_DIR . '/src/popbot.class.php';
        require_once popbotPlugin::PLUGIN_DIR . '/src/analytics.class.php';
        require_once popbotPlugin::PLUGIN_DIR . '/src/template.class.php';
        require_once popbotPlugin::PLUGIN_DIR . '/src/action.class.php';
        require_once popbotPlugin::PLUGIN_DIR . '/src/metabox.class.php';

        require_once popbotPlugin::PLUGIN_DIR . '/src/templating.php';

        Popbot_Metabox::get_instance();

        add_action('init', ['popbot\\popbotPlugin', 'registerPostType']);
        add_action('init', ['popbot\\popbotPlugin', 'registerTaxonomy']);
        add_action('init', ['popbot\\popbotPlugin', 'registerCustomConditionsPostType']);
        add_action('init', ['popbot\\popbotPlugin', 'updateUserJourney']);

        add_action('use_block_editor_for_post', ['popbot\\popbotPlugin', 'setPopbotBlockEditor'], PHP_INT_MAX, 2);

        add_action("wp_enqueue_scripts", ['popbot\\popbotPlugin', 'registerAssets']);
        add_action("admin_enqueue_scripts", ['popbot\\popbotPlugin', 'registerAssets']);
        add_action("wp_enqueue_scripts", ['popbot\\popbotPlugin', 'publicEnqueue']);
        add_action("admin_enqueue_scripts", ['popbot\\popbotPlugin', 'adminEnqueue']);
        add_action("enqueue_block_editor_assets", ['popbot\\popbotPlugin', 'editorEnqueue']);

        // add_action('init', ['popbot\\popbotPlugin', 'gutenbergInlineCSSFix']);
        add_action('wp_body_open', ['popbot\\popbotPlugin', 'renderAll']);

        add_action("admin_bar_menu", ['popbot\\popbotPlugin', 'adminBar'], 500);

        /**
         * We use redirects to templates rather then links to direct .php files
         * so that we can include all the themes styling and keep the enqueuing
         * consistent between the preview and the real pages.
         */
        add_action('parse_request', ['popbot\\popbotPlugin', 'redirectPreview']);

        // AJAX
        add_action("wp_ajax_popbotAnalytics", ['popbot\\popbotPlugin', 'ajax_analyticsEvent']);
        add_action("wp_ajax_nopriv_popbotAnalytics", ['popbot\\popbotPlugin', 'ajax_analyticsEvent']);

        add_action("wp_ajax_popbotGetAnalytics", ['popbot\\popbotPlugin', 'ajax_getAnalytics']);
        add_action("wp_ajax_popbotGetBotDetails", ['popbot\\popbotPlugin', 'ajax_getBotDetails']);
        add_action("wp_ajax_popbotDeletePost", ['popbot\\popbotPlugin', 'ajax_deletePost']);
        add_action("wp_ajax_popbotUpdateOption", ['popbot\\popbotPlugin', 'ajax_updateOption']);

        add_action("wp_ajax_inlineSave", ['popbot\\popbotPlugin', 'ajax_inlineSave']);
        add_action("wp_ajax_panelSave", ['popbot\\popbotPlugin', 'ajax_panelSave']);
        add_action("wp_ajax_getErrors", ['popbot\\popbotPlugin', 'ajax_getErrors']);


        // Shortcode
        add_shortcode('popbot', ['popbot\\popbotPlugin', 'renderShortcode']);



        // Admin Pages
        $page_home = new page([
            "slug" => "popbot-home",
            "icon" => 'data:image/svg+xml;base64,' . base64_encode(file_get_contents(static::PLUGIN_DIR . "/assets/icons/popbot.svg")),
            "title" => __("PopBot", 'popbot'),
            "redirect" => admin_url('admin.php?page=popbot-dashboard'),
            "hidden" => true,
            "template" => static::PLUGIN_DIR . '/pages/home.php',
        ]);

        $page_dashboard = new page([
            "parent" => $page_home,
            "slug" => "popbot-dashboard",
            "title" => __("Dashboard", 'popbot'),
            "template" => static::PLUGIN_DIR . '/pages/home.php',
        ]);

        $page_archive = new page([
            "parent" => $page_home,
            "slug" => "popbot-archive",
            "title" => __("All PopBots", 'popbot'),
            "template" => static::PLUGIN_DIR . '/pages/archive.php',
        ]);

        $page_edit = new page([
            "parent" => $page_home,
            "slug" => "popbot-edit",
            "title" => __("Edit PopBot", 'popbot'),
            "template" => static::PLUGIN_DIR . '/pages/edit.php',
            "hidden" => true,
        ]);

        $page_templates = new page([
            "parent" => $page_home,
            "slug" => "popbot-templates",
            "title" => __("Create a PopBot", 'popbot'),
            "template" => static::PLUGIN_DIR . '/pages/templates.php',
        ]);

        // $page_archive   = new page("popbot-archive", __("All PopBots", 'popbot'), 'archive.php');
        // $page_edit      = new page("popbot-edit", __("Edit PopBot", 'popbot'), 'edit.php', true);
        // $page_templates = new page("popbot-templates", __("Create a PopBot", 'popbot'), 'templates.php');
        // $page_settings  = new page("popbot-settings", __("Settings", 'popbot'), 'settings.php');

        // Actions
        (new Action("popbot_createBot", $page_home))->run(['popbot\\popbotPlugin', 'action_createBot']);
        (new Action("popbot_uploadTemplate", $page_templates))->run(['popbot\\popbotPlugin', 'action_uploadTemplate']);
        (new Action("popbot_setTitle", $page_templates))->run(['popbot\\popbotPlugin', 'action_setTitle']);
    }

    /**
     * Form action.
     * 
     * Creates a new PopBot post and redirects to it.
     */
    static function action_createBot(action $action, array $request)
    {
        $bot = popBot::create();

        if (array_key_exists("template", $request)) {
            $bot->setTemplate($request["template"]);
        }

        $action->succeed([], $bot->getEditLink());
    }

    static function action_uploadTemplate(action $action)
    {
        $status = [];
        $error = false;
        $files_count = count($_FILES['template']['name']);

        for ($i = 0; $i < $files_count; $i++) {
            $file = [
                'name'     => $_FILES['template']['name'][$i],
                'type'     => $_FILES['template']['type'][$i],
                'tmp_name' => $_FILES['template']['tmp_name'][$i],
                'error'    => $_FILES['template']['error'][$i],
                'size'     => $_FILES['template']['size'][$i],
                'mime'     => mime_content_type($_FILES['template']['tmp_name'][$i]),
            ];

            // Validation
            if (!is_uploaded_file($file['tmp_name'])) {
                $action->fail(__("File was not uploaded.", 'popbot'));
                return;
            }

            if ($file['size'] > 1000000) { // 1 MB
                $action->fail(__("Templates must be smaller than 1MB.", 'popbot'));
                return;
            }

            if (!in_array($file['mime'], ["text/plain", "text/html", "text/php", "application/x-httpd-php", "text/x-php"])) {
                $action->fail(__("Templates should be a .php file.", 'popbot'));
                return;
            }

            // Save
            $destination = trailingslashit(popbotPlugin::TEMPLATES_UPLOADS_DIR) . $file['name'];
            $status[sanitize_title($file['name'])] = move_uploaded_file($file['tmp_name'], $destination);
        }

        $action->succeed(array_merge($status, ["error" => $error]));
    }

    static function action_setTitle(action $action, array $request)
    {
        if (!get_post($request['post_id'])) {
            $action->fail(__("An error occured on the server, please try again.", 'popbot'));
            return;
        }

        if (!trim($request['title'])) {
            $action->fail(__("Post title cannot be empty.", 'popbot'));
            return;
        }

        $popbot = new popbot($request['post_id']);
        $popbot->setTitle($request['title']);

        $action->succeed(__("Changes Saved", 'popbot'));
    }

    /**
     * AJAX Endpoint.
     * 
     * Creates a new analytics event.
     */
    static function ajax_analyticsEvent()
    {
        $bot = new popBot($_REQUEST['id']);
        $event = $_REQUEST['event'];
        $url = $_REQUEST['url'];

        if (!$bot) {
            wp_send_json_error([
                "message" => __("PopBot not found.", 'popbot')
            ]);
        }

        analytics::insertEvent($event, $bot->getUUID(), $url);

        wp_send_json_success();
    }

    /**
     * AJAX Endpoint.
     * 
     * Gets analytics event data.
     */
    static function ajax_getAnalytics()
    {
        if (!current_user_can(popbotPlugin::CAPABILITY)) {
            wp_send_json_error([
                "message" => __("You don't have the capabilites to perform this action.", 'popbot')
            ]);
        }

        $type = $_POST['type'] ?? "count";
        $event_type = $_POST['event_type'] ?? "shown";
        $date_start = $_POST['date_start'] ?? date('01-m-Y');
        $date_end = $_POST['date_end'] ?? date('t-m-Y');
        $post_id = $_POST['post_id'] ?? false;

        $result = null;

        switch ($type) {
            case "plot":
                $result = analytics::getEventsPlot([
                    "event_type" => $event_type,
                    "date_start" => $date_start,
                    "date_end"   => $date_end,
                    "post_id"    => $post_id,
                ]);
                break;

            case "count":
            default:
                $result = analytics::getEventsCount([
                    "event_type" => $event_type,
                    "date_start" => $date_start,
                    "date_end"   => $date_end,
                    "post_id"    => $post_id,
                ]);
                break;
        }

        wp_send_json_success($result);
    }

    static function ajax_getBotDetails()
    {
        if (!current_user_can(popbotPlugin::CAPABILITY)) {
            wp_send_json_error([
                "message" => __("You don't have the capabilites to perform this action.", 'popbot')
            ]);
        }

        $post_id = $_POST['post_id'] ?? 0;

        $bot = new popBot($post_id);

        wp_send_json_success([
            "wp" => get_post($post_id),

            "id" => $bot->getUUID(),
            "title" => $bot->getTitle(),
            "edit_link" => $bot->getEditLink(),

            "tags" => $bot->getTags(),

            "trigger" => $bot->getTriggerArray(),
            "conditions" => $bot->getConditionsArray(),
            "template" => $bot->getTemplateObject(),
            "visibility" => $bot->getVisibilityArray(),
        ]);
    }

    static function ajax_deletePost()
    {
        if (!current_user_can(popbotPlugin::CAPABILITY)) {
            wp_send_json_error([
                "message" => __("You don't have the capabilites to perform this action.", 'popbot')
            ]);
        }

        $post_id = $_POST['post_id'] ?? 0;

        $bot = new popBot($post_id);
        $bot->delete();

        wp_send_json_success();
    }

    static function ajax_updateOption()
    {
        if (!current_user_can('manage_options')) {
            wp_send_json_error([
                "message" => __("You don't have the capabilites to perform this action.", 'popbot')
            ]);
        }

        $name = $_POST['name'] ?? null;
        $value = $_POST['value'] ?? null;

        if (is_null($name) || is_null($value) || !array_key_exists($name, popbotPlugin::OPTIONS_WHITELIST)) {
            wp_send_json_error([
                "message" => __("You don't have the capabilites to perform this action.", 'popbot')
            ]);
        }

        wp_send_json_success([
            "name" => $name,
            "value" => $value,
            "success" => popBotPlugin::setOption($name, $value)
        ]);
    }

    /**
     * AJAX Endpoint.
     * 
     * Updates the meta key for a popBot sent from a panel component.
     */
    static function ajax_panelSave()
    {
        if (!current_user_can(popbotPlugin::CAPABILITY)) {
            wp_send_json_error([
                "message" => __("You don't have the capabilites to perform this action.", 'popbot')
            ]);
        }

        $valid_keys = ["trigger", "conditions", "template", "visibility"];

        $nonce = $_REQUEST['nonce'];
        $post_id = $_REQUEST['post_id'] ?? "ERROR";
        $key = $_REQUEST['key'];
        $value = $_REQUEST['value'];

        if (!wp_verify_nonce($nonce, 'popbot_admin_edit_' . $post_id)) {
            wp_send_json_error([
                "message" => __("Please refresh the page to perform this action.", 'popbot')
            ]);
        }

        if (!get_post($post_id)) {
            wp_send_json_error([
                "message" => __("An error occured on the server, please try again.", 'popbot')
            ]);
        }

        if (!in_array($key, $valid_keys)) {
            wp_send_json_error([
                "message" => __("Key not recognised. Please refresh.", 'popbot')
            ]);
        }

        update_post_meta($post_id, $key, $value);

        wp_send_json_success([
            "message" => __("Changes Saved", 'popbot'),
        ]);
    }

    /**
     * AJAX Endpoint.
     * 
     * Returns all the auto-detected errors for a popBot.
     */
    static function ajax_getErrors()
    {
        if (!current_user_can(popbotPlugin::CAPABILITY)) {
            wp_send_json_error([
                "message" => __("You don't have the capabilites to perform this action.", 'popbot')
            ]);
        }

        $post_id = $_REQUEST['post_id'] ?? "ERROR";
        $post = get_post($post_id);

        if (!$post) {
            wp_send_json_error([
                "message" => __("Post not found.", 'popbot')
            ]);
        }

        $popbot = new popBot($post_id);

        wp_send_json_success([
            "message" => __("Success", 'popbot'),
            "data" => $popbot->detectConfigurationErrors()
        ]);
    }

    /**
     * Forces PopBot post type to use the block editor, even if disabled elsewhere.
     */
    static function setPopbotBlockEditor($use_block_editor, $post)
    {
        if ($post->post_type == popbotPlugin::POST_TYPE) {
            return true;
        }

        return $use_block_editor;
    }

    /**
     * Creates the PopBot post type.
     */
    static function registerPostType()
    {
        $labels = array(
            'name'                  => _x('PopBots', 'Post Type General Name', 'popbot'),
            'singular_name'         => _x('PopBot', 'Post Type Singular Name', 'popbot'),
            'menu_name'             => __('PopBots', 'popbot'),
            'name_admin_bar'        => __('PopBot', 'popbot'),
            'archives'              => __('PopBot Archives', 'popbot'),
            'attributes'            => __('PopBot Attributes', 'popbot'),
            'parent_item_colon'     => __('Parent PopBot:', 'popbot'),
            'all_items'             => __('All PopBots', 'popbot'),
            'add_new_item'          => __('Add New PopBot', 'popbot'),
            'add_new'               => __('Add New', 'popbot'),
            'new_item'              => __('New PopBot', 'popbot'),
            'edit_item'             => __('Edit PopBot', 'popbot'),
            'update_item'           => __('Update PopBot', 'popbot'),
            'view_item'             => __('View PopBot', 'popbot'),
            'view_items'            => __('View PopBots', 'popbot'),
            'search_items'          => __('Search PopBot', 'popbot'),
            'not_found'             => __('Not found', 'popbot'),
            'not_found_in_trash'    => __('Not found in Trash', 'popbot'),
            'featured_image'        => __('Featured Image', 'popbot'),
            'set_featured_image'    => __('Set featured image', 'popbot'),
            'remove_featured_image' => __('Remove featured image', 'popbot'),
            'use_featured_image'    => __('Use as featured image', 'popbot'),
            'insert_into_item'      => __('Insert into PopBot', 'popbot'),
            'uploaded_to_this_item' => __('Uploaded to this PopBot', 'popbot'),
            'items_list'            => __('PopBots list', 'popbot'),
            'items_list_navigation' => __('PopBots list navigation', 'popbot'),
            'filter_items_list'     => __('Filter PopBots list', 'popbot'),
        );

        $args = array(
            'label'                 => __('PopBot', 'popbot'),
            'description'           => __('Conversions made Easy', 'popbot'),
            'labels'                => $labels,
            'supports'              => ['title', 'editor', 'revisions'],
            'public'                => true,
            'can_export'            => true,
            'exclude_from_search'   => true,
            'publicly_queryable'    => false,
            'show_ui'               => true,
            'show_in_menu'          => false,
            'show_in_nav_menus'     => false,
            'has_archive'           => false,
            'show_in_rest'          => true,
            'taxonomies'            => [popbotPlugin::TAGS_TAXONOMY]
        );

        register_post_type(popbotPlugin::POST_TYPE, $args);
    }

    static function registerCustomConditionsPostType()
    {
        $args = array(
            'label'                 => __('Custom Conditions', 'popbot'),
            'supports'              => ['title', 'editor', 'revisions'],
            'public'                => false,
            'can_export'            => true,
            'has_archive'           => false,
            'show_in_rest'          => true,
        );

        register_post_type(popbotPlugin::CUSTOM_CONDITIONS_POST_TYPE, $args);
    }

    static function registerTaxonomy()
    {
        $labels = array(
            'name'                       => __('Tags', 'popbot'),
            'singular_name'              => __('Tag', 'popbot'),
            'menu_name'                  => __('Tag', 'popbot'),
        );

        $args = array(
            'labels'                     => $labels,
            'hierarchical'               => false,
            'public'                     => true,
            'show_ui'                    => false,
            'show_admin_column'          => false,
            'show_in_nav_menus'          => false,
            'show_tagcloud'              => false,
            'show_in_rest'               => true,
        );

        register_taxonomy(popbotPlugin::TAGS_TAXONOMY, popbotPlugin::POST_TYPE, $args);
    }

    static function setGeolocationCookies()
    {
        // "user.location.region"
        // "user.location.continent"
        // "user.location.country"
        // "user.location.city"
    }

    static function updateUserJourney(): void
    {
        if (wp_doing_ajax() || is_admin()) {
            return;
        }

        if (!array_key_exists("popBot_geolocation_city", $_COOKIE)) {
            static::setGeolocationCookies();
        }


        $expire = time() + 60 * 60 * 24 * 90; // 90 Days

        // LAST FOR 90 DAYS
        // Last page
        // Set last hit every time so we know if it's the first page in a session.
        $lastPageHit = intval($_COOKIE['popBot_journey_lastPageHit'] ?? 0);
        setcookie('popBot_journey_lastPageHit', time(), $expire, '/');

        // First visit
        // Set only once so we know when the first session was.
        $firstVisit = intval($_COOKIE['popBot_journey_firstVisitHit'] ?? time());
        if (!isset($_COOKIE['popBot_journey_firstVisitHit'])) {
            setcookie('popBot_journey_firstVisitHit', time(), $expire, '/');
        }

        // LAST FOR SESSION ONLY
        // Referrer
        if (isset($_SERVER['HTTP_REFERER'])) {
            setcookie('popBot_journey_referrer', $_SERVER['HTTP_REFERER'], 0, '/');
        } else if (!isset($_COOKIE['popBot_journey_referrer'])) {
            setcookie('popBot_journey_referrer', "", 0, '/');
        }

        // Returning
        if (time() - $firstVisit > popBotPlugin::SESSION_LENGTH_IN_SECONDS) {
            setcookie('popBot_journey_returning', 1, 0, '/');
        } else {
            setcookie('popBot_journey_returning', 0, 0, '/');
        }

        // Landing
        if (time() - $lastPageHit > popBotPlugin::SESSION_LENGTH_IN_SECONDS) {
            setcookie('popBot_journey_landing', 1, 0, '/');
        } else {
            setcookie('popBot_journey_landing', 0, 0, '/');
        }

        // Page Count
        $pagesVisited = $_COOKIE['popBot_journey_pageCount'] ?? 0;
        setcookie('popBot_journey_pageCount', intval($pagesVisited) + 1, 0, '/');
    }

    /**
     * Returns an object with all the information that front-end and back-end may need.
     */
    static function getLocalizeObject(): array
    {
        $post_id = get_the_ID();
        if (!$post_id) $post_id = $_GET['post'] ?? -1;

        $user = wp_get_current_user();

        return [
            "wp" => [
                "post_id" => $post_id,

                "has_cap" => current_user_can(static::CAPABILITY),
                "is_logged_in" => is_user_logged_in(),

                "home_url" => home_url(),
                "admin_url" => admin_url(),
                "plugin_home_url" => page::get("popbot-dashboard")->getLink(),
            ],

            "config" => [
                "pro"                   => false,   // If this is the pro version of the plugin.
                "timeBetweenPopups"     => 5000,    // Minimum time (in ms) between two pop-ups showing.
                "timeBeforeFirstPopup"  => 0,       // Minimum time (in ms) between page load and seeing a pop-up.
                "allowReshow"           => true,    // If true, popbots can show if they have been shown before (but not dismissed/converted).
            ],

            "fetch" => [
                "ajax_url" => admin_url("admin-ajax.php"),
                "nonce" => current_user_can(static::CAPABILITY) ? wp_create_nonce('popbot_admin_edit_' . $post_id) : false,
                "rest_nonce" => current_user_can(static::CAPABILITY) ? wp_create_nonce("wp_rest") : false,

                "action_nonces" => array_map(function ($o) {
                    return $o->getAJAXNonce();
                }, action::getAll()),
            ],

            "condition_values" => [
                "post.isFrontPage" => is_front_page(),
                "post.ID"     => is_singular() ? get_the_ID() : "",
                "post.title"  => is_singular() ? get_the_title() : "",
                "post.type"   => is_singular() ? get_post_type() : "",
                "post.author" => is_singular() ? get_the_author_meta("user_login") : "",

                "user.wp.isLoggedIn" => is_user_logged_in(),
                "user.wp.login"      => $user->user_login,
                "user.wp.roles"      => $user->roles,

                "date.time"      => time(),
                "date.dayOfWeek" => date('l'),
                "date.date"      => date('j'),
                "date.month"     => date('F'),
                "date.year"      => date('Y'),
            ],

            "bots" => array_map(function ($bot) {
                if ($bot->isCurrentlyVisible()) {
                    return $bot->getConstructorOptions();
                }
            }, popBot::query()),

            "templates" => template::getAll(),
        ];
    }

    static function registerAssets()
    {
        wp_register_script("popbot", popbotPlugin::PLUGIN_URL . '/assets/scripts/dist/popbot.js', [], popbotPlugin::VERSION, true);
        wp_localize_script("popbot", "popbot", static::getLocalizeObject());

        wp_register_script("popbot-debugger", popbotPlugin::PLUGIN_URL . '/assets/scripts/debugger.js', ["popbot"], popbotPlugin::VERSION, true);
        wp_register_script("popbot-components", popbotPlugin::PLUGIN_URL . '/assets/scripts/dist/components.js', ["popbot"], popbotPlugin::VERSION, false);

        wp_register_script("popbot-blocks", popbotPlugin::PLUGIN_URL . '/blocks/dist/index.js', ['popbot', 'wp-blocks', 'wp-editor', 'wp-i18n', 'wp-element'], popbotPlugin::VERSION, false);
        wp_register_style("popbot-blocks-editor", popbotPlugin::PLUGIN_URL . '/blocks/dist/editor.css');
        wp_register_style("popbot-blocks-public", popbotPlugin::PLUGIN_URL . '/blocks/dist/style-style.css');

        wp_register_style("popbot-gutenberg-css", popbotPlugin::PLUGIN_URL . '/assets/styles/blockEditor.css');
        wp_register_script("popbot-gutenberg-js", popbotPlugin::PLUGIN_URL . '/assets/scripts/blockEditor.js', popbotPlugin::VERSION, true);

        wp_register_style("material-icons", "https://fonts.googleapis.com/icon?family=Material+Icons");
        wp_register_style("gfont-poppins", "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap");
        wp_register_style("popbot-admin", popbotPlugin::PLUGIN_URL . '/assets/styles/admin.css', ["material-icons", "gfont-poppins"], popbotPlugin::VERSION);
    }

    /**
     * Enqueues all assets for the front-end.
     */
    static function publicEnqueue()
    {
        wp_enqueue_script("popbot");
        wp_enqueue_style("popbot-blocks-public");

        if (current_user_can(static::CAPABILITY)) {
            wp_enqueue_script("popbot-debugger");
        }
    }

    /**
     * Enqueues all assets for the back-end.
     */
    static function adminEnqueue($hook_suffix)
    {
        $post = get_post($_GET['post'] ?? -1);

        // PopBot Admin Pages
        if (strpos($hook_suffix, "popbot") !== false) {
            wp_enqueue_script("popbot-components");
            wp_enqueue_style("popbot-admin");
        }
    }

    /**
     * Enqueues all assets for the block editor.
     */
    static function editorEnqueue()
    {
        wp_enqueue_script("popbot-blocks");
        wp_enqueue_style("popbot-blocks-editor");

        global $post;
        if ($post->post_type == popBotPlugin::POST_TYPE) {
            wp_enqueue_style("popbot-gutenberg-css");
            wp_enqueue_script("popbot-gutenberg-js");

            if (array_key_exists('panelmode', $_GET)) {
                add_action("admin_head", function () {
                    // Hides certain buttons not needed for panel mode
                    echo "<style id='popbot-gutenberg-panelmode'>.block-editor-post-preview__button-toggle,.components-snackbar,.edit-post-fullscreen-mode-close,.editor-post-preview,.editor-post-publish-button__button,.editor-post-save-draft{display:none!important}#wpadminbar,.edit-post-post-status,.edit-post-visual-editor__post-title-wrapper,.editor-post-publish-button,.editor-post-switch-to-draft,.editor-post-title__input{display:none}#wpbody{padding-top:0!important}.interface-interface-skeleton{top:0}.editor-styles-wrapper{padding:.5rem 1.5rem 1.5rem;background:#f8fafc!important}</style>";
                });
            }

            add_filter(
                'admin_body_class',
                static function ($classes) {
                    return "$classes is-fullscreen-mode";
                }
            );
        }
    }

    /**
     * Adds the popBot debugger to the admin bar.
     */
    static function adminBar(\WP_Admin_Bar $admin_bar)
    {
        if (!current_user_can(static::CAPABILITY)) return;

        if (is_admin()) return;

        $admin_bar->add_menu(array(
            'id'    => 'popbot-debugger-open',
            'title' => "<button type='button' class='popbot-debugger-opener' style='all: inherit; cursor: pointer;'>PopBot Debugger</button>"
        ));
    }

    /**
     * Redirects popBotPreview requests.
     * 
     * We do this rather than a direct file call so we can keep all the WP & theme styles.
     */
    static function redirectPreview($wp)
    {
        // Hijack requests for ...com/popBotPreview to show our template preview (only for admins).
        if ($wp->request == "popBotPreview" && current_user_can(static::CAPABILITY)) {
            include popbotPlugin::PLUGIN_DIR . '/pages/templatePreview.php';
            die();
        }
    }

    // static function gutenbergInlineCSSFix()
    // {
    // Fixes an issue with gutenberg not inlining the needed styles for bots
    // https://github.com/WordPress/gutenberg/issues/40018
    // https://stackoverflow.com/questions/72635660/inline-styles-for-gutenberg-blocks-not-rendering-when-content-fetched-with-ajax
    // }

    /**
     * Renders all popBots.
     */
    static function renderAll()
    {
        $popBots = popBot::query();

        // Browser support backup.
        echo "<style id='popbot-css'>.popbot-container[hidden]{display:none !important}</style>";

        foreach ($popBots as $popBot) {
            if ($popBot->isCurrentlyVisible()) {
                $popBot->render();
            }
        }
    }

    /**
     * Renders a bot as a shortcode.
     */
    static function renderShortcode($attrs)
    {
        $attrs = shortcode_atts([
            "id" => -1
        ], $attrs);

        if (!get_post($attrs['id'])) return false;

        $popbot = popBot::fromUUID($attrs['id']);

        ob_start();

        $popbot->render("popbot-inline");

        $s = ob_get_clean();
        return $s;
    }

    static function setOption(string $option, $value)
    {
        if (!array_key_exists($option, popBotPlugin::OPTIONS_WHITELIST)) return "WHITELIST";

        return update_option($option, $value);
    }

    static function getOption(string $option)
    {
        if (!array_key_exists($option, popBotPlugin::OPTIONS_WHITELIST)) return false;

        $default = popBotPlugin::OPTIONS_WHITELIST[$option];
        return get_option($option, $default);
    }

    /**
     * Runs when the plugin is activated.
     * 
     * Sets the version, creates the templates uploads folder and the analytics table.
     */
    static function onActivation(): void
    {
        require_once popbotPlugin::PLUGIN_DIR . '/src/analytics.class.php';
        analytics::createTable();

        // wp_mkdir_p(self::TEMPLATES_UPLOADS_DIR);

        static::setOption("popbot_version", self::VERSION);
    }

    /**
     * Runs on uninstall.
     * 
     * Removes the analytics table.
     */
    static function onUninstall(): void
    {
        require_once popbotPlugin::PLUGIN_DIR . '/src/analytics.class.php';
        analytics::dropTable();

        foreach (popBotPlugin::OPTIONS_WHITELIST as $key => $default) {
            delete_option($key);
        }
    }
}

add_action('init', ['popbot\\popbotPlugin', 'init'], 0);
register_activation_hook(popbotPlugin::PLUGIN_FILE, ['popbot\\popbotPlugin', 'onActivation']);
register_uninstall_hook(popbotPlugin::PLUGIN_FILE, ['popbot\\popbotPlugin', 'onUninstall']);
