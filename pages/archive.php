<?php

namespace popbot;

?>


<nav-bar label="<?php _e("All Popbots", 'popbot') ?>" back>
    <tool-tip label="<?php _e("Create new Popbot", 'popbot') ?>">
        <a href="<?php echo esc_url(Admin_Page::get("popbot-templates")->get_link()) ?>" aria-label="<?php _e("Create new Popbot", 'popbot') ?>">
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