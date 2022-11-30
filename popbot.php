<?php

namespace popbot;

/**
 * Plugin Name:       PopBot
 * Description:       Convert your users with targeted pop-ups. Use triggers & rules to nudge your users towards conversions when they're ready using the perfect pop-up.
 * Version:           1.0.1
 * Requires at least: 5.2
 * Requires PHP:      7.4.0
 * Author:            Web Results Direct
 * Author URI:        https://wrd.studio.com/
 * License:           GPL v3 or later
 * License URI:       https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain:       popbot
 * Domain Path:       /languages
 */

class Popbot_Plugin
{
    const PLUGIN_FILE  = __FILE__;
    const VERSION = '1.0.1';
    const PLUGIN_DIR = WP_PLUGIN_DIR . '/popbot';
    const PLUGIN_URL = WP_PLUGIN_URL . '/popbot';
    const CONTENT_DIR = WP_CONTENT_DIR . '/popbot';
    const CONTENT_URL = WP_CONTENT_URL . '/popbot';

    public static function includes()
    {
        require_once static::PLUGIN_DIR . '/src/class-utils.php';
        require_once static::PLUGIN_DIR . '/src/class-admin-page.php';
        require_once static::PLUGIN_DIR . '/src/class-popbot.php';
        require_once static::PLUGIN_DIR . '/src/class-popbot-assets.php';
        require_once static::PLUGIN_DIR . '/src/class-popbot-analytics.php';
        require_once static::PLUGIN_DIR . '/src/class-popbot-options.php';
        require_once static::PLUGIN_DIR . '/src/class-popbot-metabox.php';
        require_once static::PLUGIN_DIR . '/src/class-popbot-template.php';
        require_once static::PLUGIN_DIR . '/src/class-custom-condition.php';
        require_once static::PLUGIN_DIR . '/src/templating.php';

        if (is_admin()) {
            require_once static::PLUGIN_DIR . '/src/class-popbot-metabox.php';
        } else {
            require_once static::PLUGIN_DIR . '/src/class-user-journey-monitor.php';
        }
    }

    public static function init()
    {
        static::includes();

        Popbot_Assets::init();
        Popbot::init();
        Custom_Condition::init();
        Popbot_Metabox::init();

        static::admin_pages();

        add_action('rest_api_init', [static::class, 'register_endpoints']);
        add_action('parse_request', [static::class, 'redirect_preview']);
        add_action('admin_bar_menu', [static::class, 'admin_bar_debugger'], 999);
    }

    public static function admin_pages()
    {
        $dashboard_page = new Admin_Page([
            'slug' => 'popbot-home',
            'icon' => 'data:image/svg+xml;base64,' . base64_encode(file_get_contents(static::PLUGIN_DIR . '/assets/icons/popbot.svg')),
            'title' => __('PopBot', 'popbot'),
            'redirect' => admin_url('admin.php?page=popbot-dashboard'),
            'hidden' => true,
            'template' => static::PLUGIN_DIR . '/pages/home.php',
            'scripts' => ['popbot-admin'],
            'styles' => ['popbot-admin'],
        ]);

        new Admin_Page([
            'parent' => $dashboard_page,
            'slug' => 'popbot-dashboard',
            'title' => __('Dashboard', 'popbot'),
            'template' => static::PLUGIN_DIR . '/pages/home.php',
            'scripts' => ['popbot-admin'],
            'styles' => ['popbot-admin'],
        ]);

        new Admin_Page([
            'parent' => $dashboard_page,
            'slug' => 'popbot-archive',
            'title' => __('All PopBots', 'popbot'),
            'template' => static::PLUGIN_DIR . '/pages/archive.php',
            'scripts' => ['popbot-admin'],
            'styles' => ['popbot-admin'],
        ]);

        new Admin_Page([
            'parent' => $dashboard_page,
            'slug' => 'popbot-edit',
            'title' => __('Edit PopBot', 'popbot'),
            'template' => static::PLUGIN_DIR . '/pages/edit.php',
            'scripts' => ['popbot-admin'],
            'styles' => ['popbot-admin'],
            'hidden' => true,
        ]);

        new Admin_Page([
            'parent' => $dashboard_page,
            'slug' => 'popbot-templates',
            'title' => __('Create a PopBot', 'popbot'),
            'template' => static::PLUGIN_DIR . '/pages/templates.php',
            'scripts' => ['popbot-admin'],
            'styles' => ['popbot-admin'],
        ]);
    }

    public static function register_endpoints()
    {
        require_once static::PLUGIN_DIR . '/src/route-analytics.php';
        require_once static::PLUGIN_DIR . '/src/route-templates.php';
        require_once static::PLUGIN_DIR . '/src/route-options.php';
        require_once static::PLUGIN_DIR . '/src/route-popbot.php';
        require_once static::PLUGIN_DIR . '/src/route-custom-conditions.php';

        foreach (Popbot::META_FIELDS as $field => $default) {
            register_post_meta(Popbot::POST_TYPE, $field, [
                'type' => 'string',
                'single' => true,
                'show_in_rest' => true,
                'default' => $default,
            ]);
        }

        $analytics_route = new Custom_Route_Popbot_Analytics();
        $analytics_route->register_routes();

        $templates_route = new Custom_Route_Popbot_Templates();
        $templates_route->register_routes();

        $options_route = new Custom_Route_Popbot_Options();
        $options_route->register_routes();

        $popbots_route = new Custom_Route_Popbot();
        $popbots_route->register_routes();

        $custom_conditions_route = new Custom_Route_Custom_Conditions();
        $custom_conditions_route->register_routes();
    }

    /**
     * Redirects popBotPreview requests.
     * 
     * We do this rather than a direct file call so we can keep all the WP & theme styles.
     */
    public static function redirect_preview($wp)
    {
        // Hijack requests for ...com/popBotPreview to show our template preview (only for admins).
        if ($wp->request == 'popBotPreview' && current_user_can(Popbot::CAPABILITY)) {
            include static::PLUGIN_DIR . '/pages/templatePreview.php';
            die();
        }
    }

    public static function admin_bar_debugger($admin_bar)
    {
        if (is_admin()) {
            return;
        }

        $admin_bar->add_node([
            'id'     => 'popbot-debugger-btn',
            'title'  => __('PopBot Debugger', 'popbot'),
            'href'   => '',
            'meta'   => [
                'class' => 'popbot-debugger-opener'
            ]
        ]);
    }

    static function activate(): void
    {
        require_once static::PLUGIN_DIR . '/src/analytics.class.php';
        Popbot_Analytics::create_table();

        Popbot_Options::set('popbot_version', self::VERSION);
    }

    static function uninstall(): void
    {
        require_once static::PLUGIN_DIR . '/src/analytics.class.php';
        Popbot_Analytics::drop_table();

        foreach (Popbot_Options::OPTIONS_WHITELIST as $key => $default) {
            delete_option($key);
        }
    }
}

add_action('init', ['popbot\\Popbot_Plugin', 'init'], 0);
register_activation_hook(Popbot_Plugin::PLUGIN_FILE, ['popbot\\Popbot_Plugin', 'activate']);
register_uninstall_hook(Popbot_Plugin::PLUGIN_FILE, ['popbot\\Popbot_Plugin', 'uninstall']);
