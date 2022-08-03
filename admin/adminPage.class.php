<?php

namespace popbot;

class adminPage
{
    function __construct(string $slug, string $title, string $template, string $parent = "")
    {
        $this->slug = $slug;
        $this->title = $title;
        $this->parent = $parent;
        $this->template = POPBOT_DIR . '/admin/pages/' . $template;

        add_action('admin_menu', array($this, 'init'));
    }

    function init()
    {
        if ($this->parent) {
            add_submenu_page(
                $this->parent,
                $this->title,
                $this->title,
                POPBOT_CAPABILITY,
                $this->slug,
                array($this, 'render'),
            );
        } else {
            add_menu_page(
                $this->title,
                $this->title,
                POPBOT_CAPABILITY,
                $this->slug,
                array($this, 'render'),
                'data:image/svg+xml;base64,' . base64_encode(file_get_contents(POPBOT_DIR . "/admin/assets/icons/popbot.svg")),
            );
        }
    }

    function render()
    {
        require $this->template;
    }
}
