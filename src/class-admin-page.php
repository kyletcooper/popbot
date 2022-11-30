<?php

namespace popbot;

$wrd_pages = [];

class Admin_Page
{
    function __construct(array $args)
    {
        $this->parent = $args['parent'] ?? false;
        if (is_a($this->parent, static::class)) $this->parent = $this->parent->slug;

        $this->slug = $args['slug'] ?? 'untitled-page';
        $this->title = $args['title'] ?? 'Untitled Page';
        $this->hidden = $args['hidden'] ?? false;
        $this->template = $args['template'] ?? '';
        $this->capability = $args['capability'] ?? 'manage_options';
        $this->icon = $args['icon'] ?? '';
        $this->redirect = $args['redirect'] ?? false;
        $this->scripts = $args['scripts'] ?? [];
        $this->styles = $args['styles'] ?? [];

        if (!is_array($this->scripts)) $this->scripts = [$this->scripts];
        if (!is_array($this->styles)) $this->styles = [$this->styles];

        add_action('admin_init', [$this, '_admin_init']);
        add_action('admin_menu', [$this, '_admin_menu']);
        add_action('admin_enqueue_scripts', [$this, '_admin_enqueue_scripts']);

        global $wrd_pages;
        $wrd_pages[$this->slug] = $this;
    }

    function is_current_page()
    {
        return isset($_GET['page']) && $_GET['page'] == $this->slug;
    }

    function _admin_init()
    {
        if ($this->is_current_page() && $this->redirect) {
            wp_redirect($this->redirect);
            exit;
        }
    }

    function _admin_enqueue_scripts()
    {
        if ($this->is_current_page()) {
            remove_all_actions('admin_notices');

            foreach ($this->scripts as $handle) {
                wp_enqueue_script($handle);
            }

            foreach ($this->styles as $handle) {
                wp_enqueue_style($handle);
            }
        }
    }

    function _admin_menu()
    {
        if ($this->parent) {
            add_submenu_page(
                $this->parent,
                $this->title,
                $this->title,
                $this->capability,
                $this->slug,
                [$this, 'render'],
            );
        } else {
            add_menu_page(
                $this->title,
                $this->title,
                $this->capability,
                $this->slug,
                [$this, 'render'],
                $this->icon,
            );
        }

        if ($this->hidden) {
            add_action('admin_footer', function () {
                echo "<style>#adminmenu .wp-submenu a[href*='" . esc_attr_e($this->slug) . "']{display: none;}</style>";
            });
        }
    }

    function render()
    {
        require $this->template;
    }

    function get_link()
    {
        return admin_url('admin.php?page=' . $this->slug);
    }

    static function get(string $slug)
    {
        global $wrd_pages;

        if (array_key_exists($slug, $wrd_pages)) {
            return $wrd_pages[$slug];
        }

        return false;
    }
}

add_action('admin_footer', function () {
    echo '<style>#toplevel_page_popbot .wp-first-item{display:none;}</style>';
});
