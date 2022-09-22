<?php

namespace popbot;

/**
 * Plugin Name:       PopBot
 * Plugin URI:        https://webresultsdirect.com/
 * Description:       Easily transfer content, themes and plugins between your staging site and live site.
 * Version:           1.0.0
 * Requires at least: 5.2
 * Requires PHP:      7.4
 * Author:            Web Results Direct
 * Author URI:        https://webresultsdirect.com/
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Update URI:        https://example.com/my-plugin/
 * Text Domain:       popbot
 * Domain Path:       /languages
 */

class popbotPlugin
{
    const PLUGIN_FILE  = __FILE__;
    const VERSION = '1.0.1';
    const PLUGIN_DIR = WP_PLUGIN_DIR . '/popbot';
    const PLUGIN_URL = WP_PLUGIN_URL . '/popbot';

    const POST_TYPE = "popbot";
    const CAPABILITY = "manage_options";

    // wp-content uploads folder
    const CONTENT_DIR = WP_CONTENT_DIR . '/popbot';
    const CONTENT_URL = WP_CONTENT_URL . '/popbot';

    // Uploaded templates go here
    const TEMPLATES_UPLOADS_DIR = self::CONTENT_DIR . '/templates';

    // Built in templates
    const TEMPLATES_PLUGIN_DIR = self::PLUGIN_DIR . '/templates';

    // Directories to scan for part
    const TEMPLATES_DIRS = [
        self::TEMPLATES_UPLOADS_DIR . '/',
        self::TEMPLATES_PLUGIN_DIR . '/',
    ];

    /**
     * Sets up all hooks, creates admin pages and includes other required classes for PopBot to run.
     * 
     * @return void
     * 
     */
    static function init()
    {
        require_once popbotPlugin::PLUGIN_DIR . '/classes/adminPage.class.php';
        require_once popbotPlugin::PLUGIN_DIR . '/classes/popbot.class.php';
        require_once popbotPlugin::PLUGIN_DIR . '/classes/popbotAnalytics.class.php';
        require_once popbotPlugin::PLUGIN_DIR . '/classes/popbotTemplate.class.php';

        require_once popbotPlugin::PLUGIN_DIR . '/templating.php';

        register_activation_hook(popbotPlugin::PLUGIN_FILE, ['popbot\\popbotPlugin', 'onActivation']);
        register_uninstall_hook(popbotPlugin::PLUGIN_FILE, ['popbot\\popbotPlugin', 'onUninstall']);

        add_action('init', ['popbot\\popbotPlugin', 'registerPostType']);

        add_action("wp_enqueue_scripts", ['popbot\\popbotPlugin', 'registerAssets']);
        add_action("admin_enqueue_scripts", ['popbot\\popbotPlugin', 'registerAssets']);

        add_action("wp_enqueue_scripts", ['popbot\\popbotPlugin', 'publicEnqueue']);
        add_action('wp_footer', ['popbot\\popbotPlugin', 'renderAll']);

        add_action("admin_enqueue_scripts", ['popbot\\popbotPlugin', 'adminEnqueue']);
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

        add_action("wp_ajax_inlineSave", ['popbot\\popbotPlugin', 'ajax_inlineSave']);
        add_action("wp_ajax_panelSave", ['popbot\\popbotPlugin', 'ajax_panelSave']);
        add_action("wp_ajax_getErrors", ['popbot\\popbotPlugin', 'ajax_getErrors']);
        add_action("wp_ajax_templateSettings", ['popbot\\popbotPlugin', 'ajax_templateSettings']);

        // Actions
        add_action('admin_action_pb_home_create', ['popbot\\popbotPlugin', 'action_createBot']);


        // Admin Pages
        new adminPage("popbot", __("PopBot", 'popbot'), 'home.php');
        new adminPage("popbot-edit", __("Edit PopBot", 'popbot'), 'edit.php', null);
        new adminPage("popbot-settings", __("Settings", 'popbot'), 'settings.php', "popbot");
        new adminPage("popbot-analytics", __("Analytics", 'popbot'), 'analytics.php', "popbot");
    }

    /**
     * Form action.
     * 
     * Creates a new PopBot post and redirects to it.
     */
    static function action_createBot()
    {
        if (!wp_verify_nonce($_POST['_wpnonce'], "pb_home_create") || !current_user_can(popbotPlugin::CAPABILITY)) {
            wp_die(__("The link you followed has expired. Please retry.", 'popbot'));
        }

        $bot = popBot::create();
        wp_redirect($bot->getEditLink());
        exit();
    }

    /**
     * AJAX Endpoint.
     * 
     * Creates a new analytics event.
     */
    static function ajax_analyticsEvent()
    {
        $bot = popBot::getBySlug($_REQUEST['id']);
        $event = $_REQUEST['event'];

        if (!$bot) {
            wp_send_json_error([
                "message" => __("PopBot not found.", 'popbot')
            ]);
        }

        $bot->addAnalyticsEvent($event);

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
                $result = popbotAnalytics::getEventsPlot([
                    "event_type" => $event_type,
                    "date_start" => $date_start,
                    "date_end"   => $date_end,
                    "post_id"    => $post_id,
                ]);
                break;

            case "count":
            default:
                $result = popbotAnalytics::getEventsCount([
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
            "enabled" => $bot->isEnabled(),
            "slug" => $bot->getSlug(),
            "title" => $bot->getTitle(),
            "edit_link" => $bot->getEditLink(),
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

        $valid_keys = ["trigger", "conditions", "template", "template_settings"];

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
     * Saves a single post field sent from an inline save component.
     */
    static function ajax_inlineSave()
    {
        if (!current_user_can(popbotPlugin::CAPABILITY)) {
            wp_send_json_error([
                "message" => __("You don't have the capabilites to perform this action.", 'popbot')
            ]);
        }

        $valid_keys = ["post_title", "post_status"];

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

        wp_update_post([
            'ID' => $post_id,
            'post_name' => "",
            $key => $value,
        ]);

        wp_send_json_success([
            "message" => __("Changes Saved", 'popbot'),
            "request" => $_POST,
            "key" => $key,
            "value" => stripslashes($value),
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
     * AJAX Endpoint.
     * 
     * Returns information about a template.
     */
    static function ajax_templateSettings()
    {
        @ini_set('display_errors', 1);

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
        $template = $popbot->getTemplateObject();

        wp_send_json_success([
            "message" => __("Success", 'popbot'),
            "settings" => $template->getSettings(),
            "values" => $popbot->getTemplateSettingsArray(),
        ]);
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
            'hierarchical'          => false,
            'public'                => false,
            'show_ui'               => true,
            'show_in_menu'          => false,
            'menu_position'         => 5,
            'show_in_admin_bar'     => false,
            'show_in_nav_menus'     => false,
            'can_export'            => true,
            'has_archive'           => false,
            'exclude_from_search'   => true,
            'publicly_queryable'    => true,
            'capability_type'       => 'page',
            'show_in_rest'          => true,
        );

        register_post_type(popbotPlugin::POST_TYPE, $args);
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
                "plugin_home_url" => admin_url('admin.php?page=popbot'),
            ],

            "config" => [
                "pro" => false,              // If this is the pro version of the plugin.
                "timeBetweenPopups" => 5000, // Minimum time (in ms) between two pop-ups showing and between opening the page and seeing a pop-up.
                "allowReshow" => true,       // If true, popbots can show if they have been shown before (but not dismissed/converted).
                "loggedInAnalytics" => false, // If true, logged in users will have their analytics actions reported.
            ],

            "fetch" => [
                "ajax_url" => admin_url("admin-ajax.php"),
                "nonce" => current_user_can(static::CAPABILITY) ? wp_create_nonce('popbot_admin_edit_' . $post_id) : false,
            ],

            "condition_values" => [
                "user.journey.referrer"     => $_SERVER['HTTP_REFERER'] ?? null,
                "user.journey.returning"    => false,
                "user.journey.landing"      => false,
                "user.journey.pageCount"    => 0,

                "user.location.region"      => false,
                "user.location.continent"   => false,
                "user.location.country"     => false,
                "user.location.city"        => false,

                "post.ID"     => get_the_ID(),
                "post.title"  => get_the_title(),
                "post.type"   => get_post_type(),
                "post.author" => get_the_author_meta("user_login"),

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
                return $bot->getConstructorOptions();
            }, popBot::query()),

            "templates" => popbotTemplate::getAll(),
        ];
    }

    static function registerAssets()
    {
        wp_register_script("popbot", popbotPlugin::PLUGIN_URL . '/assets/scripts/dist/popbot.js', [], popbotPlugin::VERSION, true);
        wp_localize_script("popbot", "popbot", static::getLocalizeObject());

        wp_register_script("popbot-debugger", popbotPlugin::PLUGIN_URL . '/assets/scripts/debugger.js', ["popbot"], popbotPlugin::VERSION, true);
        wp_register_script("popbot-components", popbotPlugin::PLUGIN_URL . '/assets/scripts/dist/components.js', ["popbot"], popbotPlugin::VERSION, false);

        wp_register_style("material-icons", "https://fonts.googleapis.com/icon?family=Material+Icons");
        wp_register_style("gfont-poppins", "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap");
        wp_register_style("popbot-admin", popbotPlugin::PLUGIN_URL . '/assets/styles/admin.css', ["material-icons", "gfont-poppins"], popbotPlugin::VERSION);
        wp_register_style("popbot-gutenberg", popbotPlugin::PLUGIN_URL . '/assets/styles/blockEditor.css');
    }

    /**
     * Enqueus all assets for the front-end.
     */
    static function publicEnqueue()
    {
        wp_enqueue_script("popbot");

        if (current_user_can(static::CAPABILITY)) {
            wp_enqueue_script("popbot-debugger");
        }
    }

    /**
     * Enqueus all assets for the back-end.
     */
    static function adminEnqueue($hook_suffix)
    {
        $post = get_post($_GET['post'] ?? -1);

        // PopBot Admin Pages
        if (strpos($hook_suffix, "popbot") !== false) {
            wp_enqueue_script("popbot-components");
            wp_enqueue_style("popbot-admin");
        }

        // Block Editor
        if ($hook_suffix == "post.php" && $post->post_type == popbotPlugin::POST_TYPE) {
            wp_enqueue_style("popbot-gutenberg");

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
        if ($wp->request == "popBotPreview" && current_user_can(popbotPlugin::CAPABILITY)) {
            include popbotPlugin::PLUGIN_DIR . '/pages/templatePreview.php';
            die();
        }
    }

    /**
     * Renders all popBots.
     */
    static function renderAll()
    {
        $popBots = popBot::query();

        // Browser support backup.
        echo "<style id='popbot-css'>.popbot-container[hidden]{display:none !important}</style>";

        foreach ($popBots as $popBot) {
            $popBot->render();
        }
    }

    /**
     * Runs when the plugin is activated.
     * 
     * Sets the version, creates the templates uploads folder and the analytics table.
     */
    static function onActivation(): void
    {
        wp_mkdir_p(self::TEMPLATES_UPLOADS_DIR);

        popbotAnalytics::createTable();

        update_option("popbot_version", self::VERSION);
    }

    /**
     * Runs on uninstaller.
     * 
     * Removes the analytics table.
     */
    static function onUninstall(): void
    {
        popbotAnalytics::dropTable();
    }
}


popbotPlugin::init();
