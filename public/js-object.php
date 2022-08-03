<?php

namespace popbot;

function getPopBotJSObject()
{
    $user = wp_get_current_user();

    // Added by JS:
    //      conditions.user.device    Using navigator.userAgentData
    //      conditions.url            Using window.location
    //      conditions.math           Using Math.random()

    return [
        "bots" => [getPopbotObject(1)],

        "conditions" => [
            "user.wp.isLoggedIn"    => is_user_logged_in(),
            "user.wp.login"         => $user->user_login,
            "user.wp.roles"         => $user->roles,

            "user.location.region"    => "",
            "user.location.continent" => "",
            "user.location.country"   => "",
            "user.location.city"      => "",

            "user.journey.referrer"  => false,
            "user.journey.returning" => false,
            "user.journey.landing"   => false,
            "user.journey.pageCount" => 0,

            "user.optimise.group" => 0,

            "post.ID"        => get_the_ID(),
            "post.title"     => get_the_title(),
            "post.type"      => get_post_type(),
            "post.author"    => get_the_author_meta("user_login"),

            "date.time"      => time(),
            "date.dayOfWeek" => date("l"),
            "date.date"      => date("j"),
            "date.month"     => date("F"),
            "date.year"      => date("Y")
        ]
    ];
}

function getPopbotObject(int $post_id)
{
    return [
        "id" => "slug",

        "trigger" => "scroll",
        "trigger_threshold" => "25",

        "conditions" => [
            "condition" => "user.wp.isLoggedIn",
            "compare" => "equals",
            "value" => "true"
        ]
    ];
}
