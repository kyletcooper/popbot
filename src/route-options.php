<?php

namespace popbot;

class Custom_Route_Popbot_Options {

	public function register_routes() {
		$version   = 1;
		$namespace = "popbot/v$version";
		$base      = 'options';

		register_rest_route(
			$namespace,
			'/' . $base . '/config',
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_config' ),
					'permission_callback' => '__return_true',
					'args'                => array(),
				),
			)
		);

		register_rest_route(
			$namespace,
			'/' . $base . '/(?P<key>[a-zA-Z0-9_-]+)',
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_option' ),
					'permission_callback' => array( $this, 'get_option_permissions_check' ),
					'args'                => array(),
				),

				array(
					'methods'             => \WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'set_option' ),
					'permission_callback' => array( $this, 'set_option_permissions_check' ),
					'args'                => $this->set_option_args(),
				),
			)
		);
	}

	public function get_option( \WP_REST_Request $request ) {
		return Popbot_Options::get( $request->get_param( 'key' ) );
	}

	public function get_option_permissions_check() {
		return current_user_can( Popbot::CAPABILITY );
	}


	public function set_option_args(): array {
		return array(
			'value' => array(
				'required' => true,
			),
		);
	}

	public function set_option( \WP_REST_Request $request ) {
		return Popbot_Options::set( $request->get_param( 'key' ), $request->get_param( 'value' ) );
	}

	public function set_option_permissions_check() {
		return current_user_can( Popbot::CAPABILITY );
	}


	public function get_config() {
		return Popbot_Options::get_config();
	}
}
