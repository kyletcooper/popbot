<?php

/**
 * Registers the metabox settings for this PopBot template.
 */

register_popbot_setting(
	array(
		'slug' => 'image',
		'name' => __( 'Image', 'popbot' ),
		'type' => 'image',
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
