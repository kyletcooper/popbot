<?php

namespace popbot;

class Custom_Route_Popbot
{
    public function register_routes()
    {
        $version = 1;
        $namespace = "popbot/v$version";
        $base = 'popbots';

        register_rest_route($namespace, '/' . $base . '/', [
            [
                'methods'             => \WP_REST_Server::READABLE,
                'callback'            => [$this, 'get_bots'],
                'permission_callback' => [$this, 'get_bots_permissions_check'],
                'args'                => $this->get_bots_args(),
            ],
            [
                'methods'             => \WP_REST_Server::CREATABLE,
                'callback'            => [$this, 'create_bot'],
                'permission_callback' => [$this, 'create_bot_permissions_check'],
                'args'                => $this->create_bot_args(),
            ],
        ]);

        register_rest_route($namespace, '/' . $base . '/(?P<uuid>[0-9_-]+)', [
            [
                'methods'             => \WP_REST_Server::READABLE,
                'callback'            => [$this, 'get_bot'],
                'permission_callback' => [$this, 'get_bot_permissions_check'],
                'args'                => [],
            ],
            [
                'methods'             => \WP_REST_Server::EDITABLE,
                'callback'            => [$this, 'update_bot'],
                'permission_callback' => [$this, 'update_bot_permissions_check'],
                'args'                => [],
            ],
            [
                'methods'             => \WP_REST_Server::DELETABLE,
                'callback'            => [$this, 'delete_bot'],
                'permission_callback' => [$this, 'delete_bot_permissions_check'],
                'args'                => $this->delete_bot_args(),
            ],
        ]);
    }

    public function prepare_item_for_response(PopBot $bot): array
    {
        return [
            'uuid'              => $bot->get_uuid(),
            'post_id'           => $bot->get_post_id(),
            'blog_id'           => $bot->get_blog_id(),
            'title'             => $bot->get_title(),
            'template'          => $bot->get_template(),
            'trigger'           => $bot->get_trigger_array(),
            'conditions'        => $bot->get_conditions_array(),
            'visibility'        => $bot->get_visibility_array(),
            'variant_parent'    => $bot->get_variant_parent(),
            'is_visible'        => $bot->is_currently_visible(),
            'is_sticky'         => $bot->is_sticky(),
            'tags'              => $bot->get_tags(),
            'edit_link'         => $bot->get_edit_link(),
            'shortcode'         => $bot->get_shortcode(),
            'errors'            => $bot->detect_configuration_errors(),
        ];
    }


    public function get_bots_args(): array
    {
        return [
            'blog_id' => [
                'type' => 'integer',
                'default' => get_current_blog_id()
            ],
            'page' => [
                'type' => 'integer',
                'default' => 1
            ],
            'per_page' => [
                'type' => 'integer',
                'default' => 20
            ],
            'variant_of' => [
                'type' => 'integer',
            ],
            'include_variants' => [
                'type' => 'boolean',
                'default' => false,
            ],
            'ignore_multisite_sticky' => [
                'type' => 'boolean',
                'default' => false,
            ],
            'is_multisite_sticky' => [
                'type' => 'boolean',
                'default' => false,
            ],
            'only_currently_visible' => [
                'type' => 'boolean',
                'default' => true,
            ],
        ];
    }

    public function get_bots(\WP_REST_Request $request)
    {
        $bots = Popbot::query($request->get_params());
        return array_map([$this, 'prepare_item_for_response'], $bots);
    }

    public function get_bots_permissions_check()
    {
        return current_user_can(Popbot::CAPABILITY);
    }


    public function create_bot_args(): array
    {
        return [
            'title' => [
                'type' => 'string',
                'default' => '',
            ],
            'template' => [
                'type' => 'string',
                'default' => '',
            ],
        ];
    }

    public function create_bot(\WP_REST_Request $request)
    {
        $bot = Popbot::create($request["title"], $request["template"]);
        return $this->prepare_item_for_response($bot);
    }

    public function create_bot_permissions_check()
    {
        return current_user_can(Popbot::CAPABILITY);
    }


    public function get_bot(\WP_REST_Request $request)
    {
        $bot = Popbot::from_uuid($request->get_param("uuid"));
        return $this->prepare_item_for_response($bot);
    }

    public function get_bot_permissions_check()
    {
        return current_user_can(Popbot::CAPABILITY);
    }


    public function update_bot_args(): array
    {
        return [
            'title' => [
                'type' => 'string',
            ],
            'template' => [
                'type' => 'string',
            ],
            'trigger' => [
                'type' => ['string', 'object'],
            ],
            'conditions' => [
                'type' => ['string', 'array'],
            ],
            'visibility' => [
                'type' => ['string', 'object'],
            ],
            'variant_parent' => [
                'type' => 'integer',
            ],
            'sticky' => [
                'type' => 'boolean',
            ],
            'tags' => [
                'type' => 'array',
            ]
        ];
    }

    public function update_bot(\WP_REST_Request $request)
    {
        // Triggers an error if not found.
        $bot = Popbot::from_uuid($request['uuid']);

        if (isset($request['title'])) {
            $bot->set_title($request['title']);
        }

        if (isset($request['template'])) {
            $bot->set_template($request['template']);
        }

        if (isset($request['trigger'])) {
            $bot->set_trigger($request['trigger']);
        }

        if (isset($request['conditions'])) {
            $bot->set_conditions($request['conditions']);
        }

        if (isset($request['visibility'])) {
            $bot->set_visibility($request['visibility']);
        }

        if (isset($request['variant_parent'])) {
            $bot->set_variant_parent($request['variant_parent']);
        }

        if (isset($request['sticky'])) {
            $bot->set_sticky(boolval($request['visibility']));
        }

        if (isset($request['tags'])) {
            $bot->set_tags($request['tags']);
        }

        return $this->prepare_item_for_response($bot);
    }

    public function update_bot_permissions_check()
    {
        return current_user_can(Popbot::CAPABILITY);
    }


    public function delete_bot_args(): array
    {
        return [
            'force' => [
                'type' => 'boolean',
                'default' => false,
            ],
        ];
    }

    public function delete_bot(\WP_REST_Request $request)
    {
        $bot = Popbot::from_uuid($request['uuid']);
        return $bot->delete($request['force']);
    }

    public function delete_bot_permissions_check()
    {
        return current_user_can(Popbot::CAPABILITY);
    }
}
