<?php

namespace popbot;

add_filter('show_admin_bar', '__return_false');
remove_action('wp_body_open', ['popbot\\Popbot', 'render_all']);

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

        $part_name = array_key_exists('part', $_GET) ? Popbot_Template::sanitize_part_name($_GET['part']) : "";
        $post_uuid = array_key_exists('post', $_GET) ? Popbot::sanitize_uuid($_GET['post']) : -1;

        if (!$part_name && $post_uuid) {
            $popbot = Popbot::from_uuid($post_uuid);
            $popbot->render_visibile();
        } else {
            $part = new Popbot_Template($part_name);
            $part->render_html($post_uuid);
            $part->enqueue_assets();
        }

        ?>
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

            if (array_key_exists('scale', $_GET)) {
                echo "transform: scale(" . floatval($_GET['scale']) . ");";
            }

            ?>
        }
    </style>
</body>

</html>