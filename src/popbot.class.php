<?php

namespace popbot;

class popBot
{
    private int $post_id;
    private \WP_Post $post;

    /**
     * Creates a popBot instance.
     */
    function __construct(int $post_id)
    {
        $post = get_post($post_id);

        if (!$post || $post->post_type != popbotPlugin::POST_TYPE) {
            trigger_error("Post not found or of wrong type.");
        }

        $this->post_id = $post_id;
        $this->post = $post;
    }

    private function _refreshPost()
    {
        $this->post = get_post($this->post_id);
    }




    /*      GETTERS AND SETTERS      */

    /**
     * @return string The unique post ID.
     * 
     * This ID is unique across multisite installations.
     */
    function getID(): int
    {
        return $this->post_id;
    }

    /**
     * Gets a PopBot by it's unique ID.
     * 
     * The ID is not the post_id, but a generated ID unique across the multisite.
     */
    static function getByID(string $id)
    {
        $post = get_post($id);

        if (!$post) return null;

        return new PopBot($post->ID);
    }

    /**
     * @return string The unique post title.
     */
    function getTitle(): string
    {
        return $this->post->post_title;
    }

    /**
     * @return int|WP_Error The post ID on success. The value 0 or WP_Error on failure.
     */
    function setTitle(string $title)
    {
        $ret = wp_update_post([
            "ID" => $this->post_id,
            "post_title" => $title,
            "post_name" => sanitize_title($title)
        ]);

        $this->_refreshPost();

        return $ret;
    }

    /**
     * @return string The post content.
     */
    function getContent(): string
    {
        return $this->post->post_content;
    }

    /**
     * @return int|bool Meta ID if the key didn't exist, true on successful update, false on failure or if the value passed to the function is the same as the one that is already in the database.
     */
    function setTemplate(string $template)
    {
        return update_post_meta($this->post_id, "template", $template);
    }

    function getTemplate(): string
    {
        return get_post_meta($this->post_id, "template", true) ?: "native/chatbox.php"; // Default template
    }

    function getTemplateObject(): template
    {
        return new template($this->getTemplate());
    }

    /**
     * @return int|bool Meta ID if the key didn't exist, true on successful update, false on failure or if the value passed to the function is the same as the one that is already in the database.
     */
    function setTrigger($trigger)
    {
        if (is_array($trigger)) $trigger = json_encode($trigger);

        return update_post_meta($this->post_id, "trigger", $trigger);
    }

    function getTrigger(): string
    {
        return get_post_meta($this->post_id, "trigger", true) ?: '{"trigger":"","threshold":""}';
    }

    function getTriggerArray(): array
    {
        return json_decode($this->getTrigger(), true);
    }

    /**
     * @return int|bool Meta ID if the key didn't exist, true on successful update, false on failure or if the value passed to the function is the same as the one that is already in the database.
     */
    function setConditions($conditions)
    {
        if (is_array($conditions)) $conditions = json_encode($conditions);

        return update_post_meta($this->post_id, "conditions", $conditions);
    }

    function getConditions(): string
    {
        return get_post_meta($this->post_id, "conditions", true) ?: "[]";
    }

    function getConditionsArray(): array
    {
        return json_decode($this->getConditions(), true);
    }

    function setVariantParent($variant_parent_id)
    {
        return update_post_meta($this->post_id, "variant_parent", $variant_parent_id);
    }

    function getVariantParent(): string
    {
        return get_post_meta($this->post_id, "variant_parent", true) ?: "0";
    }

    function getVariants(bool $include_original = true): array
    {
        $bots = static::query([
            "variant_of" => $this->post_id,
            "ignore_multisite_sticky" => true,
        ]);

        if ($include_original) {
            array_push($bots, $this);
        }

        return $bots;
    }

    /**
     * @return int|bool Meta ID if the key didn't exist, true on successful update, false on failure or if the value passed to the function is the same as the one that is already in the database.
     */
    function setVisibility($conditions)
    {
        if (is_array($conditions)) $conditions = json_encode($conditions);

        return update_post_meta($this->post_id, "visibility", $conditions);
    }

    function getVisibility(): string
    {
        return get_post_meta($this->post_id, "visibility", true) ?: '{ "visibility": "public", "start": null, "end": null }';
    }

    function getVisibilityArray(): array
    {
        return json_decode($this->getVisibility(), true);
    }

    function isCurrentlyVisible(): bool
    {
        $status     = $this->getVisibilityArray();

        $visibility = $status['visibility'];
        $start      = $status['start'];
        $end        = $status['end'];

        if ($visibility == "hidden" || $visibility == "private" && !is_user_logged_in()) {
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

    function addTags(...$tagIDs)
    {
        wp_set_post_terms($this->post_id, $tagIDs, popbotPlugin::TAGS_TAXONOMY, true);
    }

    function removeTag(...$tagIDs)
    {
        wp_remove_object_terms($this->post_id, $tagIDs, popbotPlugin::TAGS_TAXONOMY);
    }

    function toggleTag($tagID)
    {
        if ($this->hasTag($tagID)) {
            $this->removeTag($tagID);
        } else {
            $this->addTags($tagID);
        }
    }

    function hasTag($tagID)
    {
        return has_term($tagID, popbotPlugin::TAGS_TAXONOMY, $this->post_id);
    }

    function getTags()
    {
        return get_the_terms($this->post_id, popbotPlugin::TAGS_TAXONOMY);
    }

    function getEditLink(): string
    {
        $url = page::get("popbot-edit")->getLink();
        $url = add_query_arg([
            "post" => $this->post_id,
        ], $url);

        return $url;
    }

    function getShortcode(): string
    {
        return "[popbot id='$this->post_id']";
    }





    /*      HELPERS      */

    /**
     * Creates an object that contains all a popBot's required info.
     */
    function getConstructorOptions()
    {
        return [
            "title"      => $this->getTitle(),
            "id"         => $this->getID(),
            "trigger"    => $this->getTriggerArray(),
            "conditions" => $this->getConditionsArray(),
        ];
    }

    /**
     * @return WP_Error[] Array of WP_Errors
     */
    function detectConfigurationErrors()
    {
        $errors = [];

        if (!$this->getTriggerArray()['trigger']) {
            $errors[] = __("No trigger is selected.", 'popbot');
        }

        return $errors;
    }

    /**
     * Deletes the PopBot.
     * 
     * @return WP_Post|false|null — Post data on success, false or null on failure.
     */
    function delete()
    {
        return wp_delete_post($this->post_id);
    }





    /*      RENDERING       */

    /**
     * Renders the popbot's HTML.
     */
    function render($classes = ""): void
    {
        $template = $this->getTemplateObject();

        // Generate HTML
        $content = $template->getHTML($this->post_id);
        $wrapper = "<div class='popbot-container $classes' id='%s' hidden inert>%s</div>";
        $html = sprintf($wrapper, $this->getID(), $content);

        $template->enqueueAssets();

        echo $html;
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
        $args = array_merge($args, [
            'post_type' => popbotPlugin::POST_TYPE,
            'post_status' => 'any',
            'numberposts' => -1,
            'ignore_sticky_posts' => true,

            'variant_of' => '',
            'include_variants' => false,
            'ignore_multisite_sticky' => false,
        ]);


        if ($args['variant_of']) {
            $args['include_variants'] = true;

            static::addMetaQuery($args, [
                'key' => 'variant_parent',
                'value' => $args['variant_of'],
                'compare' => '=',
            ]);
        }

        if (!$args['include_variants']) {
            static::addMetaQuery($args, [
                'key' => 'variant_parent',
                'value' => 'bug #23268',
                'compare' => 'NOT EXISTS',
            ]);
        }


        $posts = get_posts($args);

        $bots = [];
        foreach ($posts as $post) {
            $bots[] = new popBot($post->ID);
        }


        if (!$args['ignore_multisite_sticky'] && is_multisite() && get_current_blog_id() !== get_main_site_id()) {
            // In multisite and not in the main site, get the sticky bots from the main site.
            // array_push($bots, ...static::queryMultisiteStickyBots($args));
        }

        return $bots;
    }

    static function addMetaQuery(array $args, array $new_meta_query, string $relation = 'AND'): array
    {
        if (array_key_exists('meta_query', $args)) {
            return [
                'relation' => $relation,
                $args['meta_query'],
                $new_meta_query,
            ];
        }

        return [
            $new_meta_query
        ];
    }

    static function queryMultisiteStickyBots(array $args = []): array
    {
        switch_to_blog(get_main_site_id());

        $default_args = [
            "meta_query" => [
                "relation" => "AND",
                [
                    "key" => "multisite_sticky",
                    "value" => 1,
                ]
            ]
        ];

        $args = array_merge($default_args, $args);
        $bots = static::query($args);

        restore_current_blog();

        return $bots;
    }

    static function create(string $title = ""): popBot
    {
        if (!$title) {
            $title = "Untitled PopBot";
        }

        $id = wp_insert_post([
            "post_title" => $title,
            "post_name" => sanitize_title($title),
            "post_type" => popbotPlugin::POST_TYPE,
            "post_status" => "publish",
        ]);

        return new popBot($id);
    }
}
