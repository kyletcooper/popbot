<?php

/**
 * Template for displaying a PopBot.
 */

?>

<div class="pb-welcomemat pb-welcomemat__align-<?php the_popbot_setting( 'align-content', 'center' ); ?>" style="
	background-color: <?php the_popbot_setting( 'background-color', '#ffffff' ); ?>;
	background-image: url('<?php echo esc_url( wp_get_attachment_image_url( popbot_setting( 'background-image', '' ), 'full' ) ); ?>');
	background-size: <?php the_popbot_setting( 'background-size', 'cover' ); ?>;
	background-position: <?php the_popbot_setting( 'background-position', 'bottom center' ); ?>;
">
	<?php the_popbot_action( '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000" class="pb-welcomemat-close">><path d="M0 0h24v24H0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>' ); ?>

	<div class="pb-welcomemat-content">
		<?php the_content(); ?>
	</div>
</div>
