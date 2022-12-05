<?php

$profile_photo_id = popbot_setting("profile-photo");
$profile_photo_url = wp_get_attachment_image_url($profile_photo_id, 'medium');

if (!$profile_photo_url) {
    $profile_photo_url = popbot_template_url('/assistant.png');
}

?>

<div class="pb-chatbox">
    <?php the_popbot_action("<span class='pb-chatbox-close'>&times;</span>") ?>

    <div class="pb-chatbox-box" style="background-color: <?php the_popbot_setting("background-color", '#ffffff') ?>">
        <?php the_content(); ?>
    </div>

    <img class="pb-chatbox-sender" src="<?php esc_attr_e($profile_photo_url) ?>" />
</div>