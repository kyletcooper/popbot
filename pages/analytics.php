<?php

namespace popbot;

?>


<wrd-header label="Analytics" back></wrd-header>


<wrd-container id="home">

    <section class="wrd-section">

        <wrd-graph event_type="converted"></wrd-graph>

        <div class="grid grid-cols-3 gap-8 mt-8">
            <?php

            $event_types = [
                "Total Views" => "shown",
                "Conversions" => "converted",
                "Dismissed" => "dismissed"
            ];

            foreach ($event_types as $label => $event_type) :
                $curr_month = popbotAnalytics::getEventsCount([
                    "event_type" => $event_type,
                    "date_start" => date('01-m-Y'), // Start of this month
                    "date_end" => date('t-m-Y'), // End of this month
                ]);

                $prev_month = popbotAnalytics::getEventsCount([
                    "event_type" => $event_type,
                    "date_start" => date('Y-m-01', strtotime('-1 MONTH')),
                    "date_end" => date('Y-m-t', strtotime('-1 MONTH')),
                ]);

            ?>

                <wrd-statistic value="<?php esc_attr_e($curr_month) ?>" previous="<?php esc_attr_e($prev_month) ?>" date="<?php esc_attr_e(date("F, Y")) ?>"><?php esc_html_e($label) ?></wrd-statistic>

            <?php endforeach; ?>
        </div>

    </section>

</wrd-container>