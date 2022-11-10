<?php

register_popbot_setting([
    "slug" => "image",
    "name" => __("Image", 'popbot'),
    "type" => "image",
]);


register_popbot_setting([
    "slug" => "background-color",
    "name" => __("Background Color", 'popbot'),
    "default" => "#ffffff",
    "type" => "color",
]);
