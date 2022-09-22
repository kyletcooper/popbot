<?php

namespace popbot;

class adminPage
{
    function __construct(string $slug, string $title, string $template, $parent = "")
    {
        $this->slug = $slug;
        $this->title = $title;
        $this->parent = $parent;
        $this->template = popbotPlugin::PLUGIN_DIR . '/pages/' . $template;

        add_action('admin_menu', array($this, 'init'));

        // Hide notices
        add_action("admin_enqueue_scripts", function ($hook) {
            if (strpos($hook, "popbot") !== false) {
                remove_all_actions('admin_notices');
            }
        });
    }

    function init()
    {
        if ($this->parent || $this->parent === null) {
            add_submenu_page(
                $this->parent,
                $this->title,
                $this->title,
                popbotPlugin::CAPABILITY,
                $this->slug,
                array($this, 'render'),
            );
        } else {
            add_menu_page(
                $this->title,
                $this->title,
                popbotPlugin::CAPABILITY,
                $this->slug,
                array($this, 'render'),
                'data:image/svg+xml;base64,' . base64_encode(file_get_contents(popbotPlugin::PLUGIN_DIR . "/assets/icons/popbot.svg")),
            );
        }
    }

    function render()
    {
        require $this->template;
    }
}
