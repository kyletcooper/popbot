<?php

namespace popbot;

?>

<header id="hero" style="background-image: url('<?php echo popBotPlugin::PLUGIN_URL . '/assets/images/bg.png' ?>')">
    <wrd-container>
        <h1>PopBot</h1>
        <p>Conversions made easy.</p>
    </wrd-container>
</header>


<wrd-container id="popbot">

    <div class="wrd-row">
        <div class="wrd-col">
            <div class="wrd-section wrd-section__clear">
                <h2>
                    <wrd-icon icon="sms_failed" label="Your PopBots" style="--fill: #D204B0"></wrd-icon>
                </h2>

                <p>
                    PopBots appear when your user needs them most to nudge them towards conversions. Give them a click to edit their appearance and triggers.
                </p>


                <?php

                $bots = popBot::query([
                    "post_status" => "any",
                    "numberposts" => 10,
                    "orderby" => "post_modified",
                    "order" => "DESC",
                ]);

                if ($bots) : ?>

                    <div class="wrd-3col">
                        <?php foreach ($bots as $bot) : ?>

                            <wrd-bot post_id="<?php echo $bot->getID() ?>"></wrd-bot>

                        <?php endforeach; ?>
                    </div>
                <?php else : ?>

                    <div class="wrd-empty">
                        <div>
                            <?php wp_nonce_field("pb_home_create") ?>
                            <input type="hidden" name="action" value="pb_home_create" />

                            <h3>
                                You haven't created any PopBots
                            </h3>

                            <a href="<?php esc_attr_e(page::get("popbot-templates")->getLink()) ?>" class="wrd-button" style="width: fit-content;">
                                <wrd-icon icon="add_circle" label="Create your First PopBot" style="--fill: #ADBAC2"></wrd-icon>
                                <wrd-icon icon="arrow_forward"></wrd-icon>
                            </a>
                        </div>

                        <svg xmlns="http://www.w3.org/2000/svg" width="212.882" height="215" viewBox="0 0 212.882 215">
                            <g id="supplies" transform="translate(-2.522 0)">
                                <g id="Group_2130" data-name="Group 2130" transform="translate(169.274 173.132)">
                                    <path id="Path_364" data-name="Path 364" d="M422.83,414.4a4.219,4.219,0,0,0-5.763-1.544l-15.336,8.853a4.219,4.219,0,1,0,4.219,7.308l15.336-8.853A4.219,4.219,0,0,0,422.83,414.4Z" transform="translate(-399.621 -412.293)" fill="#af0092" />
                                </g>
                                <g id="Group_2132" data-name="Group 2132" transform="translate(2.522 0)">
                                    <path id="Path_365" data-name="Path 365" d="M215.4,122.218a4.165,4.165,0,0,0-.034-.515c0-.011,0-.023-.006-.034a4.244,4.244,0,0,0-.092-.458c-.011-.043-.023-.084-.035-.126-.035-.123-.077-.244-.124-.365-.016-.041-.031-.084-.049-.124a4.271,4.271,0,0,0-.219-.444l-.008-.013a4.22,4.22,0,0,0-.274-.41c-.026-.036-.056-.07-.084-.1q-.121-.152-.254-.29c-.03-.032-.06-.063-.092-.093a4.148,4.148,0,0,0-.352-.309l-.026-.021a4.214,4.214,0,0,0-.429-.287l-.031-.021-49-28.29V33.727c0-.012,0-.024,0-.036a4.2,4.2,0,0,0-.034-.518c0-.009,0-.017,0-.026a4.117,4.117,0,0,0-.094-.468c-.01-.04-.022-.08-.033-.12-.036-.126-.079-.25-.127-.374-.015-.039-.029-.078-.045-.116a3.874,3.874,0,0,0-.5-.872c-.025-.034-.053-.066-.08-.1q-.123-.154-.257-.294c-.029-.031-.059-.062-.089-.092a4.244,4.244,0,0,0-.353-.311l-.025-.021a4.239,4.239,0,0,0-.43-.288c-.01-.006-.02-.014-.03-.02L111.073.565a4.219,4.219,0,0,0-4.219,0L55.745,30.073l-.029.019a4.2,4.2,0,0,0-.433.29l-.019.016a4.223,4.223,0,0,0-.358.315l-.088.09q-.135.14-.257.295c-.026.033-.055.066-.08.1a3.892,3.892,0,0,0-.5.87c-.017.039-.031.081-.047.121q-.072.183-.126.368c-.012.041-.024.082-.034.123a4.21,4.21,0,0,0-.093.462c0,.01,0,.02-.005.031a4.176,4.176,0,0,0-.034.516c0,.012,0,.024,0,.037V90.31l-49,28.291c-.01.006-.019.014-.029.02a4.134,4.134,0,0,0-.432.289l-.02.016a4.079,4.079,0,0,0-.358.315c-.03.029-.059.06-.089.09q-.134.14-.257.294c-.027.034-.055.067-.081.1a4.24,4.24,0,0,0-.276.414l0,.007a4.187,4.187,0,0,0-.221.448c-.017.04-.032.082-.048.123-.047.121-.089.243-.125.365-.012.042-.024.083-.035.125a4.157,4.157,0,0,0-.092.459c0,.011,0,.022-.006.033a4.171,4.171,0,0,0-.034.516c0,.012,0,.024,0,.036v59.02h0a4.219,4.219,0,0,0,2.109,3.654l51.114,29.507.031.016a4.229,4.229,0,0,0,.465.229l.029.011a4.225,4.225,0,0,0,.446.151c.042.012.084.022.125.032.124.031.251.055.38.075.043.007.086.015.13.02a3.9,3.9,0,0,0,1,0c.044-.005.087-.013.13-.02.129-.019.255-.044.379-.075l.126-.032a4.084,4.084,0,0,0,.444-.15l.031-.012a4.129,4.129,0,0,0,.464-.228l.033-.016,49-28.29,49,28.29.033.016a4.186,4.186,0,0,0,.463.228l.033.012a4.156,4.156,0,0,0,.443.149c.042.012.084.022.126.032.124.031.251.055.379.075.044.007.087.015.131.02a3.905,3.905,0,0,0,1,0c.044-.005.087-.013.131-.02.128-.019.255-.044.379-.075.042-.01.084-.021.126-.032a4.092,4.092,0,0,0,.443-.149l.033-.012a4.266,4.266,0,0,0,.463-.228l.033-.016,51.114-29.507a4.218,4.218,0,0,0,2.11-3.654V122.255A.279.279,0,0,0,215.4,122.218Zm-38.164-14.689-42.672,24.637L117.4,122.254l42.671-24.636ZM155.854,90.311l-42.671,24.636V65.675l42.671-24.64ZM108.963,9.091,126.129,19,83.456,43.638,66.292,33.727ZM57.854,97.619l17.163,9.909L32.344,132.164l-17.165-9.909ZM53.635,203.475,10.96,178.839V129.562l18.177,10.494a4.2,4.2,0,0,0,2.035,1.174L53.635,154.2Zm4.219-56.584-17.071-9.855L83.455,112.4l17.071,9.856Zm46.89,31.948L62.073,203.475V154.2l42.671-24.637Zm0-63.892L62.073,90.312V41.035l18.166,10.49a4.2,4.2,0,0,0,2.05,1.183l22.456,12.967v49.273ZM91.895,48.511l42.672-24.638,17.068,9.854-42.671,24.64Zm63.959,154.964-42.671-24.635V129.562l18.176,10.494a4.205,4.205,0,0,0,2.031,1.172L155.854,154.2v49.277Zm4.219-56.583L143,137.037,185.676,112.4l17.071,9.855Zm46.894,31.948-42.675,24.636V154.2l42.675-24.637Z" transform="translate(-2.522 0)" fill="#af0092" />
                                </g>
                                <g id="Group_2134" data-name="Group 2134" transform="translate(195.316 167.622)">
                                    <path id="Path_366" data-name="Path 366" d="M465.712,399.171c-5.43,0-5.438,8.438,0,8.438S471.151,399.171,465.712,399.171Z" transform="translate(-461.637 -399.171)" fill="#af0092" />
                                </g>
                            </g>
                        </svg>
                    </div>

                <?php endif; ?>
            </div>
        </div>
    </div>


    <div class="wrd-row">
        <div class="wrd-col">
            <div class="wrd-section wrd-section__clear">
                <h2>
                    <wrd-icon icon="grade" label="Your Actions" style="--fill: #D204B0"></wrd-icon>
                </h2>

                <p>
                    Quickly navigated around the PopBot plugin.
                </p>

                <div class="wrd-3col">
                    <a href="<?php esc_attr_e(page::get("popbot-templates")->getLink()); ?>" class="wrd-button">
                        <wrd-icon icon="add_circle" label="Create new PopBot" style="--fill: #ADBAC2"></wrd-icon>
                        <wrd-icon icon="arrow_forward"></wrd-icon>
                    </a>

                    <a class="wrd-button" href="<?php esc_attr_e(page::get("popbot-archive")->getLink()); ?>">
                        <wrd-icon icon="apps" label="View all PopBots" style="--fill: #ADBAC2"></wrd-icon>
                        <wrd-icon icon="arrow_forward"></wrd-icon>
                    </a>

                    <?php /*

                    <a class="wrd-button wrd-premium" href="https://webresultsdirect.com" target="_blank">
                        <wrd-icon icon="verified" label="Upgrade to Premium" style="--fill: #ADBAC2"></wrd-icon>
                        <wrd-icon icon="arrow_forward"></wrd-icon>
                    </a>

                    */ ?>
                </div>
            </div>
        </div>
    </div>


    <div class="wrd-row">
        <div class="wrd-col">
            <div class="wrd-section wrd-section__clear">
                <h2>
                    <wrd-icon icon="insights" label="Your Analytics" style="--fill: #D204B0"></wrd-icon>
                </h2>

                <p>
                    Keep track of how PopBots are driving your conversions and how users are responding to them.
                </p>

                <div class="wrd-section">
                    <wrd-graph event_type="shown"></wrd-graph>

                    <div class="wrd-3col" style="margin-top: 2rem">
                        <?php

                        $event_types = [
                            "Total Views" => "shown",
                            "Conversions" => "converted",
                            "Dismissed" => "dismissed"
                        ];

                        foreach ($event_types as $label => $event_type) :
                            $curr_month = analytics::getEventsCount([
                                "event_type" => $event_type,
                                "date_start" => date('01-m-Y'), // Start of this month
                                "date_end" => date('t-m-Y'), // End of this month
                            ]);

                            $prev_month = analytics::getEventsCount([
                                "event_type" => $event_type,
                                "date_start" => date('Y-m-01', strtotime('-1 MONTH')),
                                "date_end" => date('Y-m-t', strtotime('-1 MONTH')),
                            ]);

                        ?>

                            <wrd-statistic value="<?php esc_attr_e($curr_month) ?>" previous="<?php esc_attr_e($prev_month) ?>" date="<?php esc_attr_e(date("F, Y")) ?>"><?php esc_html_e($label) ?></wrd-statistic>

                        <?php endforeach; ?>
                    </div>
                </div>

            </div>
        </div>
    </div>

</wrd-container>