<?php

namespace popbot;

$categoriesCustom = Popbot_Template::get_all("uploads");

?>

<nav-bar back label="Choose a Template"></nav-bar>


<div id="popbot" class="wrd-container">
    <div class="wrd-section wrd-mt">
        <template-picker>
            <h2>
                <icon-label icon="dashboard" label="Default Templates" style="--fill: #D204B0"></icon-label>
            </h2>
        </template-picker>
    </div>
</div>