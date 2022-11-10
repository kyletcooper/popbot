<?php

namespace popbot;

?>


<wrd-header label="<?php _e("All Popbots", 'popbot') ?>" back>
    <wrd-tooltip label="<?php _e("Create new Popbot", 'popbot') ?>">
        <a href="<?php echo page::get("popbot-templates")->getLink() ?>" aria-label="<?php _e("Create new Popbot", 'popbot') ?>">
            <wrd-icon button icon="add"></wrd-icon>
        </a>
    </wrd-tooltip>
</wrd-header>


<wrd-container id="popbot">
    <div class="wrd-row">
        <div class="wrd-col">
            <section class="wrd-section wrd-section__clear">
                <wrd-post-archive post-type="popbot"></wrd-post-archive>
            </section>
        </div>
    </div>
</wrd-container>