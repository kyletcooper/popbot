<?php

namespace popbot;

class Custom_Route_Custom_Conditions
{
    public function register_routes()
    {
        $version = 1;
        $namespace = "popbot/v$version";
        $base = 'custom-conditions';

        register_rest_route($namespace, '/' . $base, [
            [
                'methods'             => \WP_REST_Server::READABLE,
                'callback'            => [$this, 'get_custom_conditions'],
                'permission_callback' => '__return_true',
                'args'                => $this->get_custom_conditions_args(),
            ],

            [
                'methods'             => \WP_REST_Server::CREATABLE,
                'callback'            => [$this, 'create_custom_conditions'],
                'permission_callback' => [$this, 'create_custom_conditions_permissions_check'],
                'args'                => $this->create_custom_conditions_args(),
            ],
        ]);

        register_rest_route($namespace, '/' . $base . '/(?P<id>[\d]+)', [
            [
                'methods'             => \WP_REST_Server::READABLE,
                'callback'            => [$this, 'get_custom_condition'],
                'permission_callback' => '__return_true',
                'args'                => [],
            ],
            [
                'methods'             => \WP_REST_Server::EDITABLE,
                'callback'            => [$this, 'update_custom_condition'],
                'permission_callback' => [$this, 'update_custom_condition_permissions_check'],
                'args'                => $this->update_custom_condition_args(),
            ],
            [
                'methods'             => \WP_REST_Server::DELETABLE,
                'callback'            => [$this, 'delete_custom_condition'],
                'permission_callback' => [$this, 'delete_custom_condition_permissions_check'],
                'args'                => [],
            ],
        ]);
    }

    public function prepare_item_for_response(Custom_Condition $condition): array
    {
        return [
            "id" => $condition->get_id(),
            "title" => $condition->get_title(),
            "callback" => $condition->get_callback(),
        ];
    }


    public function get_custom_conditions_args(): array
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
        ];
    }

    public function get_custom_conditions(\WP_REST_Request $request)
    {
        $conditions = Custom_Condition::query($request->get_params());
        return array_map([$this, 'prepare_item_for_response'], $conditions);
    }


    public function create_custom_conditions_args(): array
    {
        return [
            'title' => [
                'type' => 'string',
                'required' => true,
            ],
            'callback' => [
                'type' => 'string',
                'required' => true,
            ],
        ];
    }

    public function create_custom_conditions(\WP_REST_Request $request)
    {
        return $this->prepare_item_for_response(Custom_Condition::create($request->get_params()));
    }

    public function create_custom_conditions_permissions_check()
    {
        return current_user_can(Popbot::CAPABILITY);
    }


    public function get_custom_condition(\WP_REST_Request $request): array
    {
        return $this->prepare_item_for_response(new Custom_Condition($request['id']));
    }


    public function update_custom_condition_args(): array
    {
        return [
            'title' => [
                'type' => 'string',
            ],
            'callback' => [
                'type' => 'string',
            ],
        ];
    }

    public function update_custom_condition(\WP_REST_Request $request)
    {
        $cond = new Custom_Condition($request['id']);

        if (isset($request['title'])) {
            $cond->set_title($request['title']);
        }

        if (isset($request['callback'])) {
            $cond->set_callback($request['callback']);
        }

        return $this->prepare_item_for_response($cond);
    }

    public function update_custom_condition_permissions_check()
    {
        return current_user_can(Popbot::CAPABILITY);
    }


    public function delete_custom_condition(\WP_REST_Request $request)
    {
        $cond = new Custom_Condition($request['id']);
        $cond->delete();

        return $this->prepare_item_for_response($cond);
    }

    public function delete_custom_condition_permissions_check()
    {
        return current_user_can(Popbot::CAPABILITY);
    }
}
