<?php

namespace popbot;

class Popbot
{
    private int $blog_id;
    private int $post_id;
    private \WP_Post $post;

    const POST_TYPE = 'popbot';
    const TAGS_TAXONOMY = 'popbot_tag';
    const CAPABILITY = 'manage_options';
    const META_FIELDS = [
        'template'          => 'native/box',
        'trigger'           => '{"trigger":"","threshold":""}',
        'conditions'        => '[]',
        'visibility'        => '{ "visibility": "public", "start": null, "end": null }',
        'variant_parent'    => '0',
        'sticky'            => '0',
    ];
    // I'd like to use object/array types in the future but I can't get the schema to work.
    // https://make.wordpress.org/core/2019/10/03/wp-5-3-supports-object-and-array-meta-types-in-the-rest-api/

    /**
     * Creates a popBot instance.
     */
    function __construct(int $post_id, int $blog_id = null)
    {
        $this->blog_id = $blog_id ?? get_current_blog_id();
        $this->post_id = $post_id;
        $this->_refresh_post();

        if (!$this->post || $this->post->post_type != static::POST_TYPE) {
            trigger_error('Post not found or of wrong type.');
        }
    }

    public static function init()
    {
        add_action('init',                      [static::class, 'register_post_type']);
        add_action('wp_body_open',              [static::class, 'render_all']);
        add_action('use_block_editor_for_post', [static::class, 'use_block_editor_for_post'], PHP_INT_MAX, 2);

        add_shortcode('popbot', [static::class, 'render_shortcode']);
    }

    private function _refresh_post()
    {
        $this->_set_blog();
        $this->post = get_post($this->post_id);
        $this->_reset_blog();
    }

    private function _set_blog()
    {
        if (is_multisite()) {
            switch_to_blog($this->blog_id);
        }
    }

    private function _reset_blog()
    {
        if (is_multisite()) {
            restore_current_blog();
        }
    }

    private function _set_meta(string $key, $value)
    {
        $this->_set_blog();
        return update_post_meta($this->post_id, $key, $value);
        $this->_reset_blog();
    }

    private function _get_meta(string $key)
    {
        $this->_set_blog();
        return get_post_meta($this->post_id, $key, true);
        $this->_reset_blog();
    }




    /*      GETTERS AND SETTERS      */

    /**
     * @return string The unique post ID.
     * 
     * This ID is unique across multisite installations.
     */
    function get_uuid(): string
    {
        return $this->blog_id . '_' . $this->post_id;
    }

    static function from_uuid(string $uuid): Popbot
    {
        [$blog_id, $post_id] = explode('_', $uuid);
        return new Popbot($post_id, $blog_id);
    }

    function get_post_id(): int
    {
        return $this->post_id;
    }

    function get_blog_id(): int
    {
        return $this->blog_id;
    }

    /**
     * @return string The unique post title.
     */
    function get_title(): string
    {
        return $this->post->post_title;
    }

    /**
     * @return int|WP_Error The post ID on success. The value 0 or WP_Error on failure.
     */
    function set_title(string $title)
    {
        $this->_set_blog();

        $ret = wp_update_post([
            'ID' => $this->post_id,
            'post_title' => $title,
            'post_name' => sanitize_title($title)
        ]);

        $this->_reset_blog();

        $this->_refresh_post();

        return $ret;
    }

    /**
     * @return string The post content.
     */
    function get_content(): string
    {
        return $this->post->post_content;
    }

    function set_template(string $template)
    {
        $check = Popbot_Template::get($template);
        if (is_wp_error($check)) {
            return false;
        }

        return $this->_set_meta('template', $template);
    }

    function get_template(): string
    {
        return $this->_get_meta('template') ?: 'native/box'; // Default template
    }

    function get_template_object(): Popbot_Template
    {
        return new Popbot_Template($this->get_template());
    }

    function set_trigger($trigger)
    {
        if (is_array($trigger)) $trigger = json_encode($trigger);

        return $this->_set_meta('trigger', $trigger);
    }

    function get_trigger(): string
    {
        return $this->_get_meta('trigger') ?: '{"trigger":"","threshold":""}';
    }

    function get_trigger_array(): array
    {
        return json_decode($this->get_trigger(), true);
    }

    function set_conditions($conditions)
    {
        if (is_array($conditions)) $conditions = json_encode($conditions);

        return $this->_set_meta('conditions', $conditions);
    }

    function get_conditions(): string
    {
        return $this->_get_meta('conditions') ?: '[]';
    }

    function get_conditions_array(): array
    {
        return json_decode($this->get_conditions(), true);
    }

    function set_variant_parent($variant_parent_id)
    {
        $parent = get_post($variant_parent_id);
        if (is_wp_error($parent) || $parent->post_type !== Popbot::POST_TYPE) {
            false;
        }

        return $this->_set_meta('variant_parent', $variant_parent_id);
    }

    function get_variant_parent(): string
    {
        return $this->_get_meta('variant_parent') ?: '0';
    }

    function get_variants(bool $include_original = true): array
    {
        $bots = static::query([
            'variant_of' => $this->post_id,
            'ignore_multisite_sticky' => true,
        ]);

        if ($include_original) {
            array_push($bots, $this);
        }

        return $bots;
    }

    function set_visibility($visibility)
    {
        if (is_array($visibility)) $visibility = json_encode($visibility);

        return $this->_set_meta('visibility', $visibility);
    }

    function get_visibility(): string
    {
        return $this->_get_meta('visibility') ?: '{ "visibility": "public", "start": null, "end": null }';
    }

    function get_visibility_array(): array
    {
        return json_decode($this->get_visibility(), true);
    }

    function is_currently_visible(): bool
    {
        $status     = $this->get_visibility_array();

        $visibility = $status['visibility'];
        $start      = $status['start'];
        $end        = $status['end'];

        if ($visibility == 'hidden' || $visibility == 'private' && !is_user_logged_in()) {
            // If popbot is hidden
            // Or user is not logged in an the bot is private
            return false;
        }

        if (strtotime($start) && strtotime($start) < time()) {
            // Set to go live in the future
            return false;
        }

        if (strtotime($end) && strtotime($end) > time()) {
            // Set to turn off in the past
            return false;
        }

        return true;
    }

    function is_sticky(): bool
    {
        return boolval($this->_get_meta("sticky"));
    }

    function set_sticky(bool $sticky)
    {
        return $this->_set_meta("sticky", intval($sticky));
    }

    function add_tags(...$tag_ids)
    {
        $this->_set_blog();
        wp_set_post_terms($this->post_id, $tag_ids, static::TAGS_TAXONOMY, true);
        $this->_reset_blog();
    }

    function remove_tag(...$tag_ids)
    {
        $this->_set_blog();
        wp_remove_object_terms($this->post_id, $tag_ids, static::TAGS_TAXONOMY);
        $this->_reset_blog();
    }

    function toggle_tag($tag_id)
    {
        if ($this->has_tag($tag_id)) {
            $this->remove_tag($tag_id);
        } else {
            $this->add_tags($tag_id);
        }
    }

    function has_tag($tag_id)
    {
        $this->_set_blog();
        $has = has_term($tag_id, static::TAGS_TAXONOMY, $this->post_id);
        $this->_reset_blog();
        return $has;
    }

    function get_tags()
    {
        $this->_set_blog();
        $tags = get_the_terms($this->post_id, static::TAGS_TAXONOMY);
        $this->_reset_blog();

        if (!is_array($tags)) return [];

        return $tags;
    }

    function set_tags($tag_ids)
    {
        $this->_set_blog();
        $response = wp_set_post_terms($this->post_id, $tag_ids, static::TAGS_TAXONOMY, false);
        $this->_reset_blog();

        return $response;
    }

    function get_edit_link(): string
    {
        $this->_set_blog();
        $url = Admin_Page::get('popbot-edit')->get_link();
        $this->_reset_blog();

        $url = add_query_arg([
            'post' => $this->post_id,
        ], $url);

        return $url;
    }

    function get_shortcode(): string
    {
        $id = $this->get_uuid();
        return "[popbot id='$id']";
    }

    /**
     * Renders a bot as a shortcode.
     */
    static function render_shortcode($attrs)
    {
        $attrs = shortcode_atts([
            'id' => -1
        ], $attrs);

        if (!get_post($attrs['id'])) return false;

        $popbot = popBot::from_uuid($attrs['id']);

        ob_start();

        $popbot->render('popbot-inline');

        $s = ob_get_clean();
        return $s;
    }





    /*      HELPERS      */

    /**
     * Creates an object that contains all a popBot's required info.
     */
    function get_constructor_options()
    {
        return [
            'title'      => $this->get_title(),
            'id'         => $this->get_uuid(),
            'trigger'    => $this->get_trigger_array(),
            'conditions' => $this->get_conditions_array(),
        ];
    }

    /**
     * @return WP_Error[] Array of WP_Errors
     */
    function detect_configuration_errors()
    {
        $errors = [];

        if (!$this->get_trigger_array()['trigger']) {
            $errors[] = __('No trigger is selected.', 'popbot');
        }

        return $errors;
    }

    /**
     * Deletes the PopBot.
     * 
     * @return WP_Post|false|null — Post data on success, false or null on failure.
     */
    function delete(bool $force = false)
    {
        $this->_set_blog();
        $value = wp_delete_post($this->post_id . $force);
        $this->_reset_blog();

        return $value;
    }





    /*      RENDERING       */

    /**
     * Renders the popbot's HTML.
     */
    function render($classes = ''): void
    {
        $template = $this->get_template_object();

        $this->_set_blog();

        echo '<div class="popbot-container ' . esc_attr($classes) . '" id="' . esc_attr($this->get_uuid()) . '" hidden inert>';
        echo '<script>window.popbot.bots = window.popbot?.bots || []; window.popbot.bots.push(' . wp_json_encode($this->get_constructor_options()) . ')</script>';
        $template->render_html($this->post_id);
        $template->enqueue_assets();
        echo '</div>';


        $this->_reset_blog();
    }

    function render_visibile($classes = ''): void
    {
        $template = $this->get_template_object();

        $this->_set_blog();

        echo '<div class="popbot-container ' . esc_attr($classes) . '" id="' . esc_attr($this->get_uuid()) . '">';
        $template->render_html($this->post_id);
        $template->enqueue_assets();
        echo '</div>';

        $this->_reset_blog();
    }





    /*      CONDITIONS     */

    /**
     * Returns an array of popBots.
     * 
     * @param array $args Arguments to filter query. Extends the options of WP_Query with:
     *      bool    include_variants            Default false
     *      string  variant_of                  Default empty. ID of original.
     *      bool    ignore_multisite_sticky     Default false.
     *      
     * 
     * @return array Array of popBot Objects.
     */
    static function query(array $args = []): array
    {
        $default_args = [
            'blog_id' => get_current_blog_id(),
            'per_page' => 20,
            'page' => 1,
            'variant_of' => '',
            'include_variants' => false,
            'ignore_multisite_sticky' => false,
            'is_multisite_sticky' => false,
            'only_currently_visible' => true,
        ];

        $forced_args = [
            'post_type' => static::POST_TYPE,
            'post_status' => 'any',
            'ignore_sticky_posts' => true,
        ];

        $args = array_merge($default_args, $args, $forced_args);


        if ($args['per_page']) {
            $args['posts_per_page'] = $args['per_page'];
        }

        if ($args['page']) {
            $args['paged'] = $args['page'];
            unset($args['page']);
        }

        if ($args['variant_of']) {
            $args['include_variants'] = true;

            Utils::add_meta_query($args, [
                'key' => 'variant_parent',
                'value' => $args['variant_of'],
                'compare' => '=',
            ]);
        }

        if (!$args['include_variants']) {
            Utils::add_meta_query($args, [
                'key' => 'variant_parent',
                'value' => 'bug #23268',
                'compare' => 'NOT EXISTS',
            ]);
        }

        if ($args['is_multisite_sticky']) {
            Utils::add_meta_query($args, [
                'key' => 'sticky',
                'value' => '1',
                'compare' => '=',
            ]);
        }

        if (is_multisite()) switch_to_blog($args['blog_id']);
        $posts = get_posts($args);
        if (is_multisite()) restore_current_blog();

        $bots = [];
        foreach ($posts as $post) {
            $bots[] = new Popbot($post->ID);
        }

        if (!$args['ignore_multisite_sticky'] && is_multisite() && $args['blog_id'] !== get_main_site_id()) {
            // In multisite and not in the main site, get the sticky bots from the main site.
            $args['blog_id'] = get_main_site_id();
            $args['is_multisite_sticky'] = true;
            array_push($bots, ...static::query($args));
        }

        if ($args['only_currently_visible']) {
            foreach ($bots as $i => $bot) {
                if (!$bot->is_currently_visible()) {
                    unset($bots[$i]);
                }
            }
        }

        return $bots;
    }

    static function create(string $title = '', string $template): popBot
    {
        if (!$title) {
            $title = 'New PopBot';
        }

        $id = wp_insert_post([
            'post_title' => $title,
            'post_name' => sanitize_title($title),
            'post_type' => static::POST_TYPE,
            'post_status' => 'publish',
        ]);

        $bot = new Popbot($id);
        if ($template) $bot->set_template($template);

        return $bot;
    }

    /**
     * Creates the PopBot post type.
     */
    static function register_post_type()
    {
        register_post_type(static::POST_TYPE, [
            'label'                 => __('PopBot', 'popbot'),
            'description'           => __('Conversions made Easy', 'popbot'),
            'labels'                => [
                'name'                  => _x('PopBots', 'Post Type General Name', 'popbot'),
                'singular_name'         => _x('PopBot', 'Post Type Singular Name', 'popbot'),
                'menu_name'             => __('PopBots', 'popbot'),
                'name_admin_bar'        => __('PopBot', 'popbot'),
                'archives'              => __('PopBot Archives', 'popbot'),
                'attributes'            => __('PopBot Attributes', 'popbot'),
                'parent_item_colon'     => __('Parent PopBot:', 'popbot'),
                'all_items'             => __('All PopBots', 'popbot'),
                'add_new_item'          => __('Add New PopBot', 'popbot'),
                'add_new'               => __('Add New', 'popbot'),
                'new_item'              => __('New PopBot', 'popbot'),
                'edit_item'             => __('Edit PopBot', 'popbot'),
                'update_item'           => __('Update PopBot', 'popbot'),
                'view_item'             => __('View PopBot', 'popbot'),
                'view_items'            => __('View PopBots', 'popbot'),
                'search_items'          => __('Search PopBot', 'popbot'),
                'not_found'             => __('Not found', 'popbot'),
                'not_found_in_trash'    => __('Not found in Trash', 'popbot'),
                'featured_image'        => __('Featured Image', 'popbot'),
                'set_featured_image'    => __('Set featured image', 'popbot'),
                'remove_featured_image' => __('Remove featured image', 'popbot'),
                'use_featured_image'    => __('Use as featured image', 'popbot'),
                'insert_into_item'      => __('Insert into PopBot', 'popbot'),
                'uploaded_to_this_item' => __('Uploaded to this PopBot', 'popbot'),
                'items_list'            => __('PopBots list', 'popbot'),
                'items_list_navigation' => __('PopBots list navigation', 'popbot'),
                'filter_items_list'     => __('Filter PopBots list', 'popbot'),
            ],
            'supports'              => ['title', 'editor', 'revisions', 'custom-fields', 'author'],
            'public'                => true,
            'can_export'            => true,
            'exclude_from_search'   => true,
            'publicly_queryable'    => false,
            'show_ui'               => true,
            'show_in_menu'          => false,
            'show_in_nav_menus'     => false,
            'has_archive'           => false,
            'show_in_rest'          => true,
            'taxonomies'            => [static::TAGS_TAXONOMY]
        ]);

        register_taxonomy(static::TAGS_TAXONOMY, static::POST_TYPE, [
            'labels'                     => [
                'name'                       => __('Tags', 'popbot'),
                'singular_name'              => __('Tag', 'popbot'),
                'menu_name'                  => __('Tag', 'popbot'),
            ],
            'hierarchical'               => false,
            'public'                     => true,
            'show_ui'                    => false,
            'show_admin_column'          => false,
            'show_in_nav_menus'          => false,
            'show_tagcloud'              => false,
            'show_in_rest'               => true,
        ]);
    }

    static function use_block_editor_for_post($use_block_editor, $post)
    {
        if ($post->post_type == static::POST_TYPE) {
            return true;
        }

        return $use_block_editor;
    }

    public static function render_all()
    {
        $popBots = popBot::query();

        // Browser support backup.
        echo '<style id="popbot-css">.popbot-container[hidden]{display:none !important}</style>';

        foreach ($popBots as $popBot) {
            if ($popBot->is_currently_visible()) {
                $popBot->render();
            }
        }
    }

    public static function sanitize_uuid($uuid)
    {
        return preg_replace('/[^0-9_]+/', '', $uuid);
    }
}
