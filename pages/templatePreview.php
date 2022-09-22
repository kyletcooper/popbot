<?php

namespace popbot;

add_filter('show_admin_bar', '__return_false');

remove_action("wp_footer", ['popbot\\popbotPlugin', 'renderAll']);

?>

<!DOCTYPE html>
<html <?php language_attributes(); ?>>

<head>
    <meta name="viewport" content="initial-scale=1, maximum-scale=1">
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
    <main id="content">



        <!-- PopBot Preview -->
        <aside id="popBotPreview">
            <?php

            $part_name = $_GET['part'] ?? "";
            $post_id = $_GET['post'] ?? -1;

            $post = get_post($post_id);

            if (!$part_name && $post) {
                $popbot = new popBot($post_id);
                $part_name = $popbot->getTemplate();
            }

            $part = new popbotTemplate($part_name);
            echo $part->getHTML($post_id);

            ?>
        </aside>



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

        #content {
            height: 100%;
        }

        #popBotPreview {
            width: 100%;
            height: 100%;

            display: flex;
            align-items: center;
            justify-content: center;

            <?php

            if ($_GET['scale'] ?? null) {
                echo "transform: scale(" . floatval($_GET['scale']) . ");";
            }

            ?>
        }
    </style>

    <script>
        document.querySelector("#popBotPreview").querySelectorAll("*").forEach(el => {
            let styles = getComputedStyle(el);

            if (styles.getPropertyValue("position") == "fixed") {
                el.style.position = "relative";
                return;
            }
        })
    </script>
</body>

</html>