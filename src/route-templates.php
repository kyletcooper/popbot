<?php

namespace popbot;

class Custom_Route_Popbot_Templates
{
    public function register_routes()
    {
        $version = 1;
        $namespace = "popbot/v$version";
        $base = 'templates';

        register_rest_route($namespace, '/' . $base, [
            [
                'methods'             => \WP_REST_Server::READABLE,
                'callback'            => [$this, 'get_templates'],
                'permission_callback' => [$this, 'get_templates_permissions_check'],
                'args'                => $this->get_templates_args(),
            ],

            [
                'methods'             => \WP_REST_Server::CREATABLE,
                'callback'            => [$this, 'create_template'],
                'permission_callback' => [$this, 'create_template_permissions_check'],
                'args'                => $this->get_templates_args(),
            ],
        ]);

        register_rest_route($namespace, '/' . $base . '/(?P<slug>[a-zA-Z0-9\/]+)', [
            [
                'methods'             => \WP_REST_Server::READABLE,
                'callback'            => [$this, 'get_template'],
                'permission_callback' => [$this, 'get_template_permissions_check'],
                'args'                => [],
            ],
        ]);
    }


    public function get_templates_args(): array
    {
        return [
            'page' => [
                'type' => 'integer',
                'default' => 1,
            ],
            'per_page' => [
                'type' => 'integer',
                'default' => 20,
            ],
            'category' => [
                'type' => 'string',
                'default' => '',
            ]
        ];
    }

    public function get_templates(\WP_REST_Request $request)
    {
        return Popbot_Template::query($request->get_params());
    }

    public function get_templates_permissions_check()
    {
        return current_user_can(Popbot::CAPABILITY);
    }


    public function create_template_args(): array
    {
        return [
            'template' => [
                'type' => 'integer',
                'default' => 1,
            ],
        ];
    }

    public function create_template(\WP_REST_Request $request)
    {
        return new \WP_Error("not_implemented");
        // return Popbot_Template::create($request->get_file_params("template"));
    }

    public function create_template_permissions_check()
    {
        return current_user_can(Popbot::CAPABILITY);
    }


    public function get_template(\WP_REST_Request $request){
        return new Popbot_Template($request->get_param("slug"));
    }

    public function get_template_permissions_check()
    {
        return current_user_can(Popbot::CAPABILITY);
    }
}
