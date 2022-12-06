<?php

/**
 * REST API Route for PopBot Analytics.
 */

namespace popbot;

class Custom_Route_Popbot_Analytics {



	public function register_routes() {
		$version   = 1;
		$namespace = "popbot/v$version";
		$base      = 'analytics';

		register_rest_route(
			$namespace,
			'/' . $base,
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_analytics' ),
					'permission_callback' => array( $this, 'get_analytics_permissions_check' ),
					'args'                => $this->get_analytics_args(),
				),
				array(
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'create_event' ),
					'permission_callback' => array( $this, 'create_event_permissions_check' ),
					'args'                => $this->create_event_args(),
				),
			)
		);
	}


	public function get_analytics_args(): array {
		return array(
			'context'    => array(
				'type'    => 'string',
				'default' => 'plot',
				'enum'    => array( 'raw', 'plot', 'count' ),
			),

			'event_type' => array(
				'type' => 'array',
			),

			'date_start' => array(
				'type'    => 'string',
				'format'  => 'date-time',
				'default' => gmdate( 'c', strtotime( gmdate( 'Y-m-01' ) ) ), // 1st of the month in ISO8601
			),

			'date_end'   => array(
				'type'    => 'string',
				'format'  => 'date-time',
				'default' => gmdate( 'c' ), // Now in ISO8601
			),

			'order'      => array(
				'type'    => 'string',
				'default' => 'DESC',
				'enum'    => array( 'ASC', 'DESC' ),
			),
		);
	}

	public function get_analytics( \WP_REST_Request $request ) {
		switch ( $request['context'] ) {
			case 'plot':
				return Popbot_Analytics::get_event_plot( $request->get_params() );

			case 'raw':
				return Popbot_Analytics::get_events( $request->get_params() );

			case 'count':
			default:
				return Popbot_Analytics::get_event_count( $request->get_params() );
		}
	}

	public function get_analytics_permissions_check() {
		return current_user_can( Popbot::CAPABILITY );
	}


	public function create_event_args(): array {
		return array(
			'event_type' => array(
				'type'     => 'string',
				'required' => true,
			),
			'uuid'       => array(
				'type'     => 'string',
				'required' => true,
			),
			'url'        => array(
				'type'     => 'string',
				'format'   => 'url',
				'required' => true,
			),
		);
	}

	public function create_event( \WP_REST_Request $request ) {
		return Popbot_Analytics::insert_event( $request['event_type'], $request['uuid'], $request['url'] ) > 0;
	}

	public function create_event_permissions_check() {
		return true;
	}
}
