<?php

$image_id  = popbot_setting( 'image' );
$image_url = wp_get_attachment_image_url( $image_id, 'large' );

?>

<div class="pb-halfnhalf" style="background-color: <?php the_popbot_setting( 'background-color', '#ffffff' ); ?>">
	<?php the_popbot_action( '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000" class="pb-halfnhalf-close">><path d="M0 0h24v24H0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>' ); ?>

	<div class="pb-halfnhalf-wrapper">
		<div class="pb-halfnhalf-img" style="background-image: url('<?php esc_attr_e( $image_url ); ?>')"></div>

		<div class="pb-halfnhalf-content">
			<div>
				<?php the_content(); ?>
			</div>
		</div>
	</div>
</div>
