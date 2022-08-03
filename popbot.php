<?php

/**
 * Front End Steps
 *      1. Render all popBots with hidden and inert. Use post slug as the ID.
 *      2. Enqueue the JS with getPopBotJSObject() as the localised object.
 *      3. Find some way to manage triggers that have custom values. E.g. scroll 25%. Click link to "https://www..."
 */


namespace popbot;

/**
 * Plugin Name:       PopBot
 * Plugin URI:        https://webresultsdirect.com/
 * Description:       Easily transfer content, themes and plugins between your staging site and live site.
 * Version:           1.0.0
 * Requires at least: 5.2
 * Requires PHP:      7.4
 * Author:            Web Results Direct
 * Author URI:        https://webresultsdirect.com/
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Update URI:        https://example.com/my-plugin/
 * Text Domain:       popbot
 * Domain Path:       /languages
 */



const POPBOT_PLUGIN  = __FILE__;
const POPBOT_VERSION = '1.0.0';
const POPBOT_DIR     = __DIR__;

const POPBOT_CAPABILITY = "manage_options";

const POPBOT_CONTENT_DIR = WP_CONTENT_DIR . '/popbot';
const POPBOT_CONTENT_URL = WP_CONTENT_DIR . '/popbot';

const POPBOT_PARTS_DIR = POPBOT_CONTENT_DIR . '/parts';
const POPBOT_PARTS_URL = POPBOT_CONTENT_URL . '/parts';


require_once POPBOT_DIR . '/src/popbot.posttype.php';

require_once POPBOT_DIR . '/admin/adminPage.class.php';
require_once POPBOT_DIR . '/admin/adminPages.php';


function pb_activate()
{
    wp_mkdir_p(POPBOT_PARTS_DIR);
}
register_activation_hook(__FILE__, 'flightdeck\pb_activate');


function pb_uninstall()
{
}
register_uninstall_hook(__FILE__, 'flightdeck\pb_uninstall');
