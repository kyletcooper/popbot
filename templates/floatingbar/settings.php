<?php

/**
 * Registers the metabox settings for this PopBot template.
 */

register_popbot_setting(
	array(
		'slug'    => 'background-color',
		'name'    => __( 'Background Color', 'popbot' ),
		'default' => '#ffffff',
		'type'    => 'color',
	)
);

register_popbot_setting(
	array(
		'slug' => 'background-image',
		'name' => __( 'Background Image', 'popbot' ),
		'type' => 'image',
	)
);

register_popbot_setting(
	array(
		'slug'    => 'background-size',
		'name'    => __( 'Background Size', 'popbot' ),
		'type'    => 'background-size',
		'default' => 'cover',
	)
);

register_popbot_setting(
	array(
		'slug'    => 'background-position',
		'name'    => __( 'Background Position', 'popbot' ),
		'type'    => 'position',
		'default' => 'bottom center',
	)
);
