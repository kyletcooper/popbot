<?php

/**
 * Registers the metabox settings for this PopBot template.
 */

register_popbot_setting(
	array(
		'slug'    => 'padding',
		'name'    => __( 'Padding', 'popbot' ),
		'default' => 40,
		'min'     => 0,
		'max'     => 75,
		'type'    => 'slider',
	)
);


register_popbot_setting(
	array(
		'slug'    => 'background-color',
		'name'    => __( 'Background Color', 'popbot' ),
		'default' => '#ffffff',
		'type'    => 'color',
	)
);
