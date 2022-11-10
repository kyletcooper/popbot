<?php

namespace popbot;

add_filter('show_admin_bar', '__return_false');

remove_action("wp_body_open", ['popbot\\popbotPlugin', 'renderAll']);

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
        $post_id = $_GET['post'] ?? -1;

        $post = get_post($post_id);

        if (!$part_name && $post) {
            $popbot = new popBot($post_id);
            $part_name = $popbot->getTemplate();
        }

        $part = new template($part_name);
        echo $part->getHTML($post_id);

        ?>

        <style>
            <?php echo $part->getCSS($post_id); ?>
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