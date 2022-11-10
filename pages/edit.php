<?php

namespace popbot;

global $post;
$post_id = $_GET["post"] ?? -1;
$post = get_post($post_id);

if (!setup_postdata($post)) {
    wp_die(__("Post not found", 'popbot'));
}

$popbot = new popBot(get_the_ID());

?>

<wrd-appearance-panel id="appearancePanel" value="<?php echo $popbot->getTemplate(); ?>"></wrd-appearance-panel>
<wrd-trigger-panel id="triggerPanel" value='<?php echo $popbot->getTrigger(); ?>'></wrd-trigger-panel>
<wrd-conditions-panel id="conditionsPanel" value='<?php echo $popbot->getConditions(); ?>'></wrd-conditions-panel>
<wrd-visibility-panel id="visibilityPanel" value='<?php echo $popbot->getVisibility(); ?>'></wrd-visibility-panel>


<wrd-header back>
    <wrd-inline-editable id="title" key="post_title" value="<?php the_title(); ?>" slot="title"></wrd-inline-editable>

    <wrd-tooltip label="Rename">
        <wrd-icon icon="text_fields" aria-label="Rename" title="Rename" button onclick="window.title.focus()"></wrd-icon>
    </wrd-tooltip>

    <wrd-tooltip label="Manage Visibility">
        <wrd-icon icon="lock_clock" button onclick="window.visibilityPanel.openPanel()"></wrd-icon>
    </wrd-tooltip>

    <wrd-tooltip label="Delete PopBot">
        <wrd-trash-button post="<?php echo get_the_ID() ?>"></wrd-trash-button>
    </wrd-tooltip>
</wrd-header>


<wrd-container>
    <div class="wrd-row">

        <aside class="wrd-col">
            <div class="wrd-section">
                <wrd-bot-preview post="<?php echo get_the_ID() ?>" scale="0.75" show-errors show-controls style="min-height: 50vh;"></wrd-bot-preview>

                <wrd-tag-picker post="<?php echo get_the_ID() ?>"></wrd-tag-picker>
            </div>

            <div class="wrd-section wrd-mt">
                <h3>
                    <wrd-icon icon="data_array" label="Display Inline" style="--fill: #ADBAC2"></wrd-icon>
                </h3>

                <p>
                    Add your PopBot as static features on a page.
                </p>

                <wrd-input readonly label="Shortcode" value="<?php echo $popbot->getShortcode() ?>"></wrd-input>

                <ol>
                    <li>PopBots added by shortcode can still appear on pages without the shortcode.</li>
                    <li>Trigger must still fire & conditions must still be met to be visible.</li>
                    <li>Inline PopBots don't care if other bots are showing.</li>
                </ol>
            </div>
        </aside>

        <main class="wrd-col-12 wrd-col-lg-6 wrd-col-xl-8">

            <button type="button" onclick="window.appearancePanel.openPanel()" class="wrd-section wrd-mb">
                <h2>
                    <wrd-icon icon="palette" label="Customise Appearance" style="--fill: #ADBAC2"></wrd-icon>
                </h2>

                <p>
                    Make design decisions and customise the content of your pop-up so that it fits your website and brand perfectly.
                </p>

                <wrd-panel-indicator for="appearancePanel" type="text"></wrd-panel-indicator>
            </button>


            <button type="button" onclick="window.triggerPanel.openPanel()" class="wrd-section wrd-mb">
                <h2>
                    <wrd-icon icon="plumbing" label="Choose a Trigger" style="--fill: #ADBAC2"></wrd-icon>
                </h2>

                <p>
                    When a user performs a certain action your PopBot will attempt to show, as long as all it's conditions are met.
                </p>

                <wrd-panel-indicator for="triggerPanel" type="trigger"></wrd-panel-indicator>
            </button>


            <button type="button" onclick="window.conditionsPanel.openPanel()" class="wrd-section wrd-mb">
                <h2>
                    <wrd-icon icon="checklist" label="Manage Conditions" style="--fill: #ADBAC2"></wrd-icon>
                </h2>

                <p>
                    Limit the instances when a PopBot can fired. You can create rules based on the user, time of day and many more.
                </p>

                <wrd-panel-indicator for="conditionsPanel" label="Conditions active"></wrd-panel-indicator>
            </button>

        </main>

    </div>
</wrd-container>

<?php wp_reset_postdata(); ?>