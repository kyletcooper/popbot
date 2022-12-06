<?php

namespace popbot;

class Popbot_Options {

	const OPTIONS_WHITELIST = array(
		'popbot_version'                     => false,
		'popbot_license'                     => '',
		'popbot_pro'                         => false,

		'popbot_require_rewrite_rules_flush' => false,

		'popbot_config_timeBetweenPopups'    => 5000,
		'popbot_config_allowReshow'          => true,
	);

	public static function set( string $option, $value ) {
		if ( ! array_key_exists( $option, static::OPTIONS_WHITELIST ) ) {
			return 'WHITELIST';
		}

		update_option( $option, $value );
		return static::get( $option );
	}

	public static function get( string $option ) {
		if ( ! array_key_exists( $option, static::OPTIONS_WHITELIST ) ) {
			return false;
		}

		$default = static::OPTIONS_WHITELIST[ $option ];
		return get_option( $option, $default );
	}

	public static function get_config() {
		return array(
			'pro'                  => false,   // If this is the pro version of the plugin.
			'timeBetweenPopups'    => 5000,    // Minimum time (in ms) between two pop-ups showing.
			'timeBeforeFirstPopup' => 0,       // Minimum time (in ms) between page load and seeing a pop-up.
			'allowReshow'          => true,    // If true, popbots can show if they have been shown before (but not dismissed/converted).
		);
	}
}
