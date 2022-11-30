<?php

namespace popbot;

class Custom_Route_Popbot_Analytics
{
    public function register_routes()
    {
        $version = 1;
        $namespace = "popbot/v$version";
        $base = 'analytics';

        register_rest_route($namespace, '/' . $base, [
            [
                'methods'             => \WP_REST_Server::READABLE,
                'callback'            => [$this, 'get_analytics'],
                'permission_callback' => [$this, 'get_analytics_permissions_check'],
                'args'                => $this->get_analytics_args(),
            ],
            [
                'methods'             => \WP_REST_Server::CREATABLE,
                'callback'            => [$this, 'create_event'],
                'permission_callback' => [$this, 'create_event_permissions_check'],
                'args'                => $this->create_event_args(),
            ],
        ]);
    }


    public function get_analytics_args(): array
    {
        return [
            'context' => [
                'type' => 'string',
                'default' => 'plot',
                'enum' => ['raw', 'plot', 'count'],
            ],

            'event_type' => [
                'type' => 'array',
            ],

            'date_start' => [
                'type' => 'string',
                'format' => 'date-time',
                'default' => date('c', strtotime(date('Y-m-01'))) // 1st of the month in ISO8601
            ],

            'date_end' => [
                'type' => 'string',
                'format' => 'date-time',
                'default' => date('c') // Now in ISO8601
            ],

            'order' => [
                'type' => 'string',
                'default' => 'DESC',
                'enum' => ['ASC', 'DESC'],
            ]
        ];
    }

    public function get_analytics(\WP_REST_Request $request)
    {
        switch ($request['context']) {
            case 'plot':
                return Popbot_Analytics::get_event_plot($request->get_params());
                break;

            case 'raw':
                return Popbot_Analytics::get_events($request->get_params());
                break;

            case 'count':
            default:
                return Popbot_Analytics::get_event_count($request->get_params());
                break;
        }
    }

    public function get_analytics_permissions_check()
    {
        return current_user_can(Popbot::CAPABILITY);
    }


    public function create_event_args(): array
    {
        return [
            'event_type' => [
                'type' => 'string',
                'required' => true,
            ],
            'uuid' => [
                'type' => 'string',
                'required' => true,
            ],
            'url' => [
                'type' => 'string',
                'format' => 'url',
                'required' => true,
            ],
        ];
    }

    public function create_event(\WP_REST_Request $request)
    {
        return Popbot_Analytics::insert_event($request['event_type'], $request['uuid'], $request['url']) > 0;
    }

    public function create_event_permissions_check()
    {
        return true;
    }
}
