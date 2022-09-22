<?php

/**
 * Name: Chat Box
 * Version: 1.0
 * Type: Template
 * Category: Social
 * Position: Bottom Right
 * Author: Web Results Direct
 * Author URI: www.webresultsdirect.com
 * License: GNU General Public License v2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html 
 */

define_popbot_setting("image", [
    "label" => "Profile Photo",
    "type" => "media",
    "return_type" => "url",
    "default" => "https://cdn2.psychologytoday.com/assets/styles/manual_crop_1_91_1_1528x800/public/field_blog_entry_images/2018-09/shutterstock_648907024.jpg?itok=7lrLYx-B",
]);

?>

<div class="pb-chatbox">
    <?php the_popbot_action("<span class='pb-chatbox-close'>&times;</span>") ?>

    <div class="pb-chatbox-box">
        <?php the_content(); ?>
    </div>

    <img class="pb-chatbox-sender" src="<?php the_popbot_setting("image") ?>" />
</div>

<style>
    .pb-chatbox {
        position: fixed;
        bottom: 1.5rem;
        right: 1.5rem;
        z-index: 999;

        padding-bottom: 2rem;
        padding-right: 2rem;

        transform-origin: bottom right;

        min-width: 12rem;
        width: fit-content;
        max-width: 28rem;
        min-height: 8rem;
    }

    .pb-chatbox-box {
        background: #fff;
        padding: 1.5rem;
        border-radius: 0.4rem;
        box-shadow: 0.5rem 0.5rem 1.5rem rgba(0, 0, 0, 0.1);
    }

    .pb-chatbox-box>*:first-child {
        margin-top: 0px !important;
    }

    .pb-chatbox-box>*:last-child {
        margin-bottom: 0px !important;
    }

    .pb-chatbox-close {
        display: block;
        cursor: pointer;

        font-size: 2rem;
        font-weight: 900;

        position: absolute;
        top: 0;
        right: 0;
    }

    .pb-chatbox-sender {
        position: absolute;
        bottom: 0px;
        right: 0px;

        display: block;

        width: 5rem;
        height: 5rem;

        object-fit: cover;

        border-radius: 100%;
        border: none;
    }

    .entering .pb-chatbox {
        animation: pb-chatbox-enter 0.5s cubic-bezier(0.17, 1.56, 0.68, 1.01) forwards;

    }

    .leaving .pb-chatbox {
        animation: pb-chatbox-exit 0.5s ease-out forwards;
    }

    @keyframes pb-chatbox-enter {
        from {
            transform: scale(0.4) rotate(-20deg);
            opacity: 0;
        }
    }

    @keyframes pb-chatbox-exit {
        to {
            transform: scale(0);
            opacity: 0;
        }
    }
</style>