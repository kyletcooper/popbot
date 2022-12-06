<?php

/**
 * Registers the metabox settings for this PopBot template.
 */

register_popbot_setting(
	array(
		'slug' => 'profile-photo',
		'name' => __( 'Profile Photo', 'popbot' ),
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
