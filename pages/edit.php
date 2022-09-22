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


<wrd-header back>
    <wrd-inline-editable id="title" key="post_title" value="<?php the_title(); ?>" slot="title"></wrd-inline-editable>

    <wrd-icon icon="edit" aria-label="Rename" title="Rename" button onclick="window.title.focus()"></wrd-icon>
    <wrd-visibility-toggle post="<?php echo get_the_ID() ?>" value="<?php echo get_post_status() ?>"></wrd-visibility-toggle>
</wrd-header>


<wrd-container id="pb-edit">
    <main>

        <button type="button" onclick="window.appearancePanel.openPanel()" class="wrd-section">
            <h2>
                <wrd-icon icon="palette" label="Customise Appearance" style="--fill: #ADBAC2"></wrd-icon>
            </h2>

            <p class="mb-6">
                Make design decisions and customise the content of your pop-up so that it fits your website and brand perfectly.
            </p>

            <wrd-panel-indicator for="appearancePanel" type="text"></wrd-panel-indicator>
        </button>


        <button type="button" onclick="window.triggerPanel.openPanel()" class="wrd-section">
            <h2>
                <wrd-icon icon="plumbing" label="Choose a Trigger" style="--fill: #ADBAC2"></wrd-icon>
            </h2>

            <p class="mb-6">
                When a user performs a certain action your PopBot will attempt to show, as long as all it's conditions are met.
            </p>

            <wrd-panel-indicator for="triggerPanel" type="trigger"></wrd-panel-indicator>
        </button>


        <button type="button" onclick="window.conditionsPanel.openPanel()" class="wrd-section">
            <h2>
                <wrd-icon icon="checklist" label="Manage Conditions" style="--fill: #ADBAC2"></wrd-icon>
            </h2>

            <p class="mb-6">
                Limit the instances when a PopBot can fired. You can create rules based on the user, time of day and many more.
            </p>

            <wrd-panel-indicator for="conditionsPanel" label="Conditions active"></wrd-panel-indicator>
        </button>

    </main>

    <aside>
        <div class="wrd-section" style="height: 50vh;">
            <wrd-bot-preview post="<?php echo get_the_ID() ?>" scale="0.75"></wrd-bot-preview>
        </div>
    </aside>

</wrd-container>

<?php wp_reset_postdata(); ?>