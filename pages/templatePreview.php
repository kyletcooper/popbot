<?php

namespace popbot;

add_filter('show_admin_bar', '__return_false');

remove_action("wp_body_open", ['popbot\\popbotPlugin', 'render_all']);

?>

<!DOCTYPE html>
<html <?php language_attributes(); ?>>

<head>
    <meta name="viewport" content="initial-scale=1, maximum-scale=1">
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
    <main id="popBotPreview">
        <?php

        $part_name = $_GET['part'] ?? "";
        $post_uuid = $_GET['post'] ?? -1;

        if (!$part_name && $post_uuid) {
            $popbot = Popbot::from_uuid($post_uuid);
            $part_name = $popbot->get_template();
        }

        $part = new Popbot_Template($part_name);
        echo $part->get_html($post_uuid);

        ?>

        <style>
            <?php echo strip_tags($part->get_css()); ?>
        </style>
    </main>

    <?php wp_footer(); ?>

    <style>
        html {
            height: 100%;
        }

        body {
            height: 100%;
            overflow: hidden !important;
            background: transparent !important;
        }

        #popBotPreview {
            width: 100%;
            height: 100%;

            <?php

            if ($_GET['scale'] ?? null) {
                echo "transform: scale(" . floatval($_GET['scale']) . ");";
            }

            ?>
        }
    </style>
</body>

</html>