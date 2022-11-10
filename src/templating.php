<?php

use popbot\popBot;
use popbot\popbotPlugin;

/**
 * Returns the value of a template setting.
 */
function popbot_setting(string $slug, string $default = ""): string
{
    $value = get_post_meta(get_the_ID(), $slug, true);

    if ($value === '' || $value === false) {
        return $default;
    }

    return $value;
}

/**
 * Displays the value of a template setting.
 */
function the_popbot_setting(string $name, string $default = ""): void
{
    echo popbot_setting($name, $default);
}

/**
 * Adds a setting for a template.
 */
function register_popbot_setting(array $opts)
{
    add_filter("popbot_template_settings", function ($settings) use ($opts) {
        array_push($settings, $opts);
        return $settings;
    });
}

/**
 * Returns a HTML string for an action.
 * 
 * @param $action Possible values are 'dismiss' and 'convert'. Defaults to 'dismiss'.
 * 
 * Links and buttons are automatically considered a conversion and don't need marking with this function.
 */
function popbot_action(string $content = '', string $action = "dismiss"): string
{
    $labels = [
        "dismiss" => __("Close", 'popbot'),
        "convert" => __("", 'popbot'),
    ];

    if (!array_key_exists($action, $labels)) {
        trigger_error(__("popbot_action: Action not known."));
    }

    $label = $labels[$action] ?? "";
    $wrapper = "<button type='button' aria-label='%s' data-popbot='%s' style='all: initial; display: block; background: none; border: none; padding: 0; margin: 0;'>%s</button>";

    return sprintf($wrapper, $label, $action, $content);
}

/**
 * Displays an action.
 */
function the_popbot_action(string $content = '', string $action = "dismiss"): void
{
    echo popbot_action($content, $action);
}
