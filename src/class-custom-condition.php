<?php

/**
 * Contains the Custom_Condtion class.
 */

namespace popbot;

/**
 * Manages a Custom Condition post type.
 */
class Custom_Condition {



	const POST_TYPE = 'popbot_condition';

	private int $post_id;
	private \WP_Post $post;

	public function __construct( int $post_id ) {
		$this->post_id = $post_id;
		$this->update_internal_post();
	}

	private function update_internal_post() {
		static::set_blog();

		$this->post = get_post( $this->post_id );

		static::reset_blog();
	}

	public function get_id(): int {
		return $this->post_id;
	}

	public function get_title(): string {
		return $this->post->post_title;
	}

	public function set_title( string $title ): bool {
		static::set_blog();

		$id = wp_update_post(
			array(
				'ID'         => $this->get_id(),
				'post_title' => $title,
			)
		);

		static::reset_blog();

		$this->update_internal_post();
		return $id > 0;
	}

	public function get_callback(): string {
		return $this->post->post_content;
	}

	public function set_callback( string $callback ): bool {
		static::set_blog();

		$id = wp_update_post(
			array(
				'ID'           => $this->get_id(),
				'post_content' => $callback,
			)
		);

		static::reset_blog();

		$this->update_internal_post();
		return $id > 0;
	}

	public function delete(): bool {
		return (bool) wp_delete_post( $this->post_id );
	}

	private static function set_blog() {
		if ( is_multisite() ) {
			switch_to_blog( get_main_site_id() );
		}
	}

	private static function reset_blog() {
		if ( is_multisite() ) {
			restore_current_blog();
		}
	}

	public static function init() {
		add_action( 'init', array( static::class, 'register_post_type' ) );
	}

	public static function register_post_type() {
		register_post_type(
			static::POST_TYPE,
			array(
				'label'        => __( 'Custom Conditions', 'popbot' ),
				'supports'     => array( 'title', 'editor', 'revisions' ),
				'public'       => false,
				'can_export'   => true,
				'has_archive'  => false,
				'show_in_rest' => true,
			)
		);
	}

	public static function create( array $args = array() ) {
		static::set_blog();

		$args = array_merge(
			array(
				'title'    => 'Untitled Custom Condition',
				'callback' => 'return 1;',
			)
		);

		$post_id = wp_insert_post(
			array(
				'post_title'   => $args['title'],
				'post_name'    => sanitize_title( $args['title'] ),
				'post_content' => $args['callback'],
				'post_type'    => static::POST_TYPE,
				'post_status'  => 'publish',
			)
		);

		$condition = new Custom_Condition( $post_id );

		static::reset_blog();
		return $condition;
	}

	public static function query( array $args = array() ) {
		static::set_blog();

		$default_args = array(
			'per_page' => -1,
			'page'     => 1,
		);

		$forced_args = array(
			'post_type'           => static::POST_TYPE,
			'post_status'         => 'any',
			'ignore_sticky_posts' => true,
		);

		$args = array_merge( $default_args, $args, $forced_args );

		if ( $args['per_page'] ) {
			$args['posts_per_page'] = $args['per_page'];
		}

		if ( $args['page'] ) {
			$args['paged'] = $args['page'];
			unset( $args['page'] );
		}

		$posts      = get_posts( $args );
		$conditions = array();

		foreach ( $posts as $post ) {
			$conditions[] = new Custom_Condition( $post->ID );
		}

		static::reset_blog();
		return $conditions;
	}
}
