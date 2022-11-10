<?php

register_popbot_setting([
    "slug" => "profile-photo",
    "name" => __("Profile Photo", 'popbot'),
    "type" => "image",
]);

register_popbot_setting([
    "slug" => "background-color",
    "name" => __("Background Color", 'popbot'),
    "default" => "#ffffff",
    "type" => "color",
]);
