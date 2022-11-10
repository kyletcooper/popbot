<?php

namespace popbot;

?>


<wrd-header label="Settings" back></wrd-header>


<wrd-container id="popbot">

    <div class="wrd-row">
        <div class="wrd-col">
            <section class="wrd-section">

                <h2>
                    <wrd-icon icon="psychology" label="Behaviour" style="--fill: #D204B0"></wrd-icon>
                </h2>

                <wrd-option label="Time Between Pop-ups" name="popbot_config_timeBetweenPopups" value="<?php echo popbotPlugin::getOption("popbot_config_timeBetweenPopups") ?>"></wrd-option>

                <wrd-option label="Allow Reshow" name="popbot_config_allowReshow" value="<?php echo popbotPlugin::getOption("popbot_config_allowReshow") ?>"></wrd-option>

            </section>
        </div>
    </div>

</wrd-container>