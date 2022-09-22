<?php

use popbot\popBot;

function get_popbot_setting(string $name): string
{
    $post = get_post();

    $opts = get_popbot_setting_opts($name);
    $default = $opts["default"] ?? "default";

    if (!$post) return $default;

    $popbot = new popBot(get_the_ID());
    $settings = $popbot->getTemplateSettingsArray();

    if (!array_key_exists($name, $settings)) return $default;

    return $settings[$name];
}

function the_popbot_setting(string $name, array $opts = []): void
{
    echo get_popbot_setting($name, $opts);
}

/**
 * @param $action Possible values are 'dismiss' and 'convert'. Defaults to 'dismiss'.
 * 
 * Links and buttons are automatically considered a conversion and don't need marking with this function.
 */
function get_popbot_action(string $content = '', string $action = "dismiss"): string
{
    $labels = [
        "dismiss" => __("Close", 'popbot'),
        "convert" => __("", 'popbot'),
    ];

    if (!array_key_exists($action, $labels)) {
        trigger_error(__("get_popbot_action: Action not known."));
    }

    $label = $labels[$action] ?? "";
    $wrapper = "<button type='button' aria-label='%s' data-popbot='%s' style='all: initial; display: block; background: none; border: none; padding: 0; margin: 0;'>%s</button>";

    return sprintf($wrapper, $label, $action, $content);
}

function the_popbot_action(string $content = '', string $action = "dismiss"): void
{
    echo get_popbot_action($content, $action);
}

function get_popbot_setting_opts($name)
{
    global $popbot_settings;
    if (is_null($popbot_settings)) $popbot_settings = [];

    foreach ($popbot_settings as $popbot_setting) {
        if ($popbot_setting['name'] == $name) return $popbot_setting;
    }

    return null;
}

function define_popbot_setting(string $name, array $opts = [])
{
    global $popbot_settings;
    if (is_null($popbot_settings)) $popbot_settings = [];

    $opts["name"] = $name;
    $popbot_settings[] = $opts;
}
