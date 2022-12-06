<?php

/**
 * Contains the Utils class.
 */

namespace popbot;

/**
 * Contains a range of useful static methods.
 */
class Utils {


	static function add_meta_query( array $args, array $new_meta_query, string $relation = 'AND' ): array {
		if ( array_key_exists( 'meta_query', $args ) ) {
			return array(
				'relation' => $relation,
				$args['meta_query'],
				$new_meta_query,
			);
		}

		return array(
			$new_meta_query,
		);
	}
}
