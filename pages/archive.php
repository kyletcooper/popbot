<?php

/**
 * Template for displaying all the PopBots.
 */

namespace popbot;

?>


<nav-bar label="<?php esc_attr_e( 'All Popbots', 'popbot' ); ?>" back>
	<tool-tip label="<?php esc_attr_e( 'Create new Popbot', 'popbot' ); ?>">
		<a href="<?php echo esc_url( Admin_Page::get( 'popbot-templates' )->get_link() ); ?>" aria-label="<?php esc_attr_e( 'Create new Popbot', 'popbot' ); ?>">
			<icon-label button icon="add"></icon-label>
		</a>
	</tool-tip>
</nav-bar>


<div id="popbot" class="wrd-container">
	<div class="wrd-row">
		<div class="wrd-col">
			<section class="wrd-section wrd-section__clear">
				<post-archive post-type="popbot"></post-archive>
			</section>
		</div>
	</div>
</div>
