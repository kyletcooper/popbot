<?php

namespace popbot;

class Custom_Route_Popbot_Options
{
    public function register_routes()
    {
        $version = 1;
        $namespace = "popbot/v$version";
        $base = 'options';

        register_rest_route($namespace, '/' . $base . '/config', [
            [
                'methods'             => \WP_REST_Server::READABLE,
                'callback'            => [$this, 'get_config'],
                'permission_callback' => '__return_true',
                'args'                => [],
            ],
        ]);

        register_rest_route($namespace, '/' . $base . '/(?P<key>[a-zA-Z0-9_-]+)', [
            [
                'methods'             => \WP_REST_Server::READABLE,
                'callback'            => [$this, 'get_option'],
                'permission_callback' => [$this, 'get_option_permissions_check'],
                'args'                => [],
            ],

            [
                'methods'             => \WP_REST_Server::EDITABLE,
                'callback'            => [$this, 'set_option'],
                'permission_callback' => [$this, 'set_option_permissions_check'],
                'args'                => $this->set_option_args(),
            ],
        ]);
    }

    public function get_option(\WP_REST_Request $request)
    {
        return Popbot_Options::get($request->get_param("key"));
    }

    public function get_option_permissions_check()
    {
        return current_user_can(Popbot::CAPABILITY);
    }


    public function set_option_args(): array
    {
        return [
            'value' => [
                'required' => true,
            ],
        ];
    }

    public function set_option(\WP_REST_Request $request)
    {
        return Popbot_Options::set($request->get_param("key"), $request->get_param("value"));
    }

    public function set_option_permissions_check()
    {
        return current_user_can(Popbot::CAPABILITY);
    }


    public function get_config()
    {
        return Popbot_Options::get_config();
    }
}
