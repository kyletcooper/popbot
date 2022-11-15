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







<wrd-header back>
    <wrd-inline-editable id="title" key="post_title" value="<?php the_title(); ?>" slot="title"></wrd-inline-editable>

    <wrd-tooltip label="Rename">
        <wrd-icon icon="text_fields" aria-label="Rename" title="Rename" button onclick="window.title.focus()"></wrd-icon>
    </wrd-tooltip>

    <wrd-tooltip label="Tags">
        <wrd-tag-picker post="<?php echo get_the_ID() ?>"></wrd-tag-picker>
    </wrd-tooltip>

    <wrd-tooltip label="Delete">
        <wrd-trash-button post="<?php echo get_the_ID() ?>"></wrd-trash-button>
    </wrd-tooltip>
</wrd-header>


<wrd-container>
    <div class="wrd-row">

        <main class="wrd-col-12 wrd-col-xl-8 wrd-col-xxl-7">
            <h2 class="wrd-h3">Edit</h2>

            <div class="wrd-section" style="padding:0;">
                <wrd-panel-opener icon="palette" label="Appearance">
                    <wrd-appearance-panel id="appearancePanel" value="<?php echo $popbot->getTemplate(); ?>"></wrd-appearance-panel>
                </wrd-panel-opener>

                <wrd-panel-opener icon="ads_click" label="Trigger">
                    <wrd-trigger-panel id="triggerPanel" value='<?php echo $popbot->getTrigger(); ?>'></wrd-trigger-panel>
                </wrd-panel-opener>

                <wrd-panel-opener icon="rule" label="Conditions">
                    <wrd-conditions-panel id="conditionsPanel" value='<?php echo $popbot->getConditions(); ?>'></wrd-conditions-panel>
                </wrd-panel-opener>

                <wrd-panel-opener icon="event" label="Visibility">
                    <wrd-visibility-panel id="visibilityPanel" value='<?php echo $popbot->getVisibility(); ?>'></wrd-visibility-panel>
                </wrd-panel-opener>

                <wrd-panel-opener icon="data_array" label="Display Inline">
                    <wrd-panel header="Display Inline">
                        <div class="wrd-p">
                            <wrd-input readonly label="Shortcode" value="<?php echo $popbot->getShortcode() ?>"></wrd-input>

                            <p>
                                Add your PopBot as static features on a page.
                            </p>

                            <ol>
                                <li>PopBots added by shortcode can still appear on pages without the shortcode.</li>
                                <li>Trigger must still fire & conditions must still be met to be visible.</li>
                                <li>Inline PopBots don't care if other bots are showing.</li>
                            </ol>
                        </div>
                    </wrd-panel>
                </wrd-panel-opener>
            </div>
        </main>

        <aside class="wrd-col">
            <h2 class="wrd-h3">Preview</h2>

            <div class="wrd-section">
                <wrd-bot-preview post="<?php echo get_the_ID() ?>" scale="0.75" show-errors show-controls style="min-height: 50vh;"></wrd-bot-preview>
            </div>
        </aside>

    </div>
</wrd-container>

<?php wp_reset_postdata(); ?>