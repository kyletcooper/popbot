<?php

namespace popbot;

class Popbot_Assets
{

    const DEFERRED_SCRIPTS = array('popbot', 'popbot-editor');

    public static function init()
    {
        add_action('wp_enqueue_scripts', array(static::class, 'register'), 0);
        add_action('admin_enqueue_scripts', array(static::class, 'register'), 0);

        // Admin enqueues are handled by Admin_Page class
        add_action('wp_enqueue_scripts', array(static::class, 'enqueue_public'));
        add_action('enqueue_block_editor_assets', array(static::class, 'enqueue_editor'));
        add_filter('script_loader_tag', array(static::class, 'defer_scripts'), 10, 3);
    }

    public static function get_localize_object(): array
    {
        $user    = wp_get_current_user();
        $post_id = get_the_ID();
        if (!$post_id) {
            $post_id = array_key_exists('post', $_GET) ? intval($_GET['post']) : -1; // phpcs:ignore -- This is not form data.
        }

        return array(
            'post_id'          => $post_id,
            'home_url'         => home_url(),
            'rest_url'         => rest_url(),
            'admin_url'        => admin_url(),
            'plugin_url'       => Admin_Page::get('popbot-dashboard')->get_link(),
            'rest_nonce'       => wp_create_nonce('wp_rest'),

            'config'           => Popbot_Options::get_config(),

            'serverConditions' => array(
                'post.isFrontPage'   => is_front_page(),
                'post.ID'            => is_singular() ? get_the_ID() : '',
                'post.title'         => is_singular() ? get_the_title() : '',
                'post.type'          => is_singular() ? get_post_type() : '',
                'post.author'        => is_singular() ? get_the_author_meta('user_login') : '',

                'user.wp.isLoggedIn' => is_user_logged_in(),
                'user.wp.login'      => $user->user_login,
                'user.wp.roles'      => $user->roles,

                'date.time'          => time(),
                'date.dayOfWeek'     => date('l'),
                'date.date'          => date('j'),
                'date.month'         => date('F'),
                'date.year'          => date('Y'),
            ),
        );
    }

    public static function register()
    {
        $ver = Popbot_Plugin::VERSION;

        wp_register_script('popbot', Popbot_Plugin::PLUGIN_URL . '/assets/scripts/dist/public.js', array(), $ver, false);
        wp_localize_script('popbot', 'popbot', static::get_localize_object());

        // Debugger (front end for admins only)
        if (current_user_can(Popbot::CAPABILITY)) {
            wp_register_script('popbot-debugger', Popbot_Plugin::PLUGIN_URL . '/assets/scripts/debugger.js', array('popbot'), $ver, false);
        }

        // Admin
        wp_register_script('popbot-admin', Popbot_Plugin::PLUGIN_URL . '/assets/scripts/dist/admin.js', array('popbot'), $ver, false);
        wp_register_style('material-icons', 'https://fonts.googleapis.com/icon?family=Material+Icons&display=block', array(), $ver);
        wp_register_style('gfont-poppins', 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap', array(), $ver);
        wp_register_style('popbot-admin', Popbot_Plugin::PLUGIN_URL . '/assets/styles/wrd.css', array('material-icons', 'gfont-poppins'), $ver);

        // Editor
        wp_register_script('popbot-editor', Popbot_Plugin::PLUGIN_URL . '/assets/scripts/dist/editor.js', array(), $ver, false);
        wp_register_style('popbot-editor', Popbot_Plugin::PLUGIN_URL . '/assets/styles/blockEditor.css', array(), $ver);
    }

    public static function enqueue_public()
    {
        wp_enqueue_script('popbot');

        if (current_user_can(Popbot::CAPABILITY)) {
            wp_enqueue_script('popbot-debugger');
        }
    }

    public static function enqueue_editor()
    {
        global $post;
        if ($post->post_type === Popbot::POST_TYPE) {
            wp_enqueue_style('popbot-editor');
            wp_enqueue_script('popbot-editor');

            if (array_key_exists('panelmode', $_GET)) { // phpcs:ignore -- This is not form data.
                // Hides certain buttons not needed for panel mode.

                add_action(
                    'admin_head',
                    function () {
                        echo '<style id="popbot-editor-panelmode">.block-editor-post-preview__button-toggle,.components-snackbar,.edit-post-fullscreen-mode-close,.editor-post-preview,.editor-post-publish-button__button,.editor-post-save-draft{display:none!important}#wpadminbar,.edit-post-post-status,.edit-post-visual-editor__post-title-wrapper,.editor-post-publish-button,.editor-post-switch-to-draft,.editor-post-title__input{display:none}#wpbody{padding-top:0!important}.interface-interface-skeleton{top:0}.editor-styles-wrapper{padding:.5rem 1.5rem 1.5rem;background:#f8fafc!important}</style>';
                    }
                );

                add_filter(
                    'admin_body_class',
                    function ($classes) {
                        return "$classes is-fullscreen-mode";
                    }
                );
            }
        }
    }


    public static function defer_scripts($tag, $handle, $url)
    {
        if (in_array($handle, static::DEFERRED_SCRIPTS, true)) {
            $tag = '<script type="text/javascript" src="' . esc_url($url) . '" id="' . esc_attr($handle) . '" defer></script>';
        }

        return $tag;
    }
}
