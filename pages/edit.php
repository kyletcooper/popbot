<?php

/**
 * Template for displaying the PopBot editor.
 */

namespace popbot;

global $post;
$post_id = intval($_GET['post']) ?? -1; // phpcs:ignore -- This is not form data. Permission is checked before this template is loaded by WP Core.
$post    = get_post($post_id); // phpcs:ignore -- Asigning to global as this is a custom editor page.

if ( ! setup_postdata( $post ) ) {
	wp_die( esc_html__( 'Post not found', 'popbot' ) );
}

$popbot = new Popbot( get_the_ID() );

?>







<nav-bar back>
	<inline-editable id="title" uuid="<?php echo esc_attr( $popbot->get_uuid() ); ?>" key="post_title" slot="title"></inline-editable>

	<tag-picker post="<?php echo esc_attr( get_the_ID() ); ?>"></tag-picker>
</nav-bar>


<div class="wrd-container">
	<div class="wrd-row">

		<main class="wrd-col-12 wrd-col-xl-8 wrd-col-xxl-7">
			<h2 class="wrd-h3">Edit</h2>

			<div class="wrd-section" style="padding:0;">
				<panel-opener icon="palette" label="Appearance">
					<panel-appearance uuid="<?php echo esc_attr( $popbot->get_uuid() ); ?>"></panel-appearance>
				</panel-opener>

				<panel-opener icon="ads_click" label="Trigger">
					<panel-trigger uuid="<?php echo esc_attr( $popbot->get_uuid() ); ?>"></panel-trigger>
				</panel-opener>

				<panel-opener icon="rule" label="Conditions">
					<panel-conditions uuid="<?php echo esc_attr( $popbot->get_uuid() ); ?>"></panel-conditions>
				</panel-opener>

				<panel-opener icon="event" label="Visibility">
					<panel-visibility uuid="<?php echo esc_attr( $popbot->get_uuid() ); ?>"></panel-visibility>
				</panel-opener>

				<panel-opener icon="data_array" label="Display Inline">
					<off-canvas header="Display Inline">
						<div class="wrd-p">
							<floating-input readonly label="Shortcode" value="<?php echo esc_attr( $popbot->get_shortcode() ); ?>"></floating-input>

							<p>
								Add your PopBot as static features on a page.
							</p>

							<ol>
								<li>PopBots added by shortcode can still appear on pages without the shortcode.</li>
								<li>Trigger must still fire & conditions must still be met to be visible.</li>
								<li>Inline PopBots don't care if other bots are showing.</li>
							</ol>
						</div>
					</off-canvas>
				</panel-opener>
			</div>
		</main>

		<aside class="wrd-col">
			<h2 class="wrd-h3">Preview</h2>

			<div class="wrd-section">
				<preview-bot uuid="<?php echo esc_attr( $popbot->get_uuid() ); ?>" scale="0.75" show-errors show-controls style="min-height: 50vh;"></preview-bot>
			</div>
		</aside>

	</div>
</div>

<?php wp_reset_postdata(); ?>
