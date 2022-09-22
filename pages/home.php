<?php

namespace popbot;

?>

<wrd-header label="PopBot Home"></wrd-header>

<wrd-container id="home">

    <div class="wrd-section wrd-section__clear">
        <h2>
            <wrd-icon icon="sms_failed" label="Your PopBots" style="--fill: #D204B0"></wrd-icon>
        </h2>

        <p>
            These bots will appear when all their conditions are met. Give them a click to edit their appearance and triggers.
        </p>

        <wrd-scroller>
            <?php

            $bots = popBot::query([
                "post_status" => "any",
                "numberposts" => 99,
                "orderby" => "post_modified",
                "order" => "DESC",
            ]);

            foreach ($bots as $bot) : ?>

                <wrd-bot post_id="<?php echo $bot->getID() ?>"></wrd-bot>

            <?php endforeach; ?>
        </wrd-scroller>
    </div>


    <div class="wrd-section wrd-section__clear">
        <h2>
            <wrd-icon icon="grade" label="Your Actions" style="--fill: #D204B0"></wrd-icon>
        </h2>

        <p>
            These bots will appear when all their conditions are met. Give them a click to edit their appearance and triggers.
        </p>

        <form method="POST" action="<?php echo admin_url('admin.php'); ?>">
            <?php wp_nonce_field("pb_home_create") ?>
            <input type="hidden" name="action" value="pb_home_create" />
            <button class="bg-brand-500 text-white py-3 px-6 rounded hover:bg-brand-600">Create new PopBot</button>
        </form>
    </div>

</wrd-container>