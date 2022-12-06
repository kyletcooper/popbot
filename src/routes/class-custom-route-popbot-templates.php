<?php

/**
 * REST API Route for PopBot Templates.
 */

namespace popbot;

class Custom_Route_Popbot_Templates {


	public function register_routes() {
		$version   = 1;
		$namespace = "popbot/v$version";
		$base      = 'templates';

		register_rest_route(
			$namespace,
			'/' . $base,
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_templates' ),
					'permission_callback' => array( $this, 'get_templates_permissions_check' ),
					'args'                => $this->get_templates_args(),
				),

				array(
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'create_template' ),
					'permission_callback' => array( $this, 'create_template_permissions_check' ),
					'args'                => $this->get_templates_args(),
				),
			)
		);

		register_rest_route(
			$namespace,
			'/' . $base . '/(?P<slug>[a-zA-Z0-9\/]+)',
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_template' ),
					'permission_callback' => array( $this, 'get_template_permissions_check' ),
					'args'                => array(),
				),
			)
		);
	}


	public function get_templates_args(): array {
		return array(
			'page'     => array(
				'type'    => 'integer',
				'default' => 1,
			),
			'per_page' => array(
				'type'    => 'integer',
				'default' => 20,
			),
			'category' => array(
				'type'    => 'string',
				'default' => '',
			),
		);
	}

	public function get_templates( \WP_REST_Request $request ) {
		return Popbot_Template::query( $request->get_params() );
	}

	public function get_templates_permissions_check() {
		return current_user_can( Popbot::CAPABILITY );
	}


	public function create_template_args(): array {
		return array(
			'template' => array(
				'type'    => 'integer',
				'default' => 1,
			),
		);
	}

	public function create_template() {
		return new \WP_Error( 'not_implemented' );
	}

	public function create_template_permissions_check() {
		return current_user_can( Popbot::CAPABILITY );
	}


	public function get_template( \WP_REST_Request $request ) {
		return new Popbot_Template( $request->get_param( 'slug' ) );
	}

	public function get_template_permissions_check() {
		return current_user_can( Popbot::CAPABILITY );
	}
}
