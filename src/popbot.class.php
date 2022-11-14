<?php

namespace popbot;

class popBot
{
    private int $blog_id;
    private int $post_id;
    private \WP_Post $post;

    /**
     * Creates a popBot instance.
     */
    function __construct(int $post_id, int $blog_id = null)
    {
        $this->blog_id = $blog_id ?? get_current_blog_id();
        $this->post_id = $post_id;
        $this->_refreshPost();

        if (!$this->post || $this->post->post_type != popbotPlugin::POST_TYPE) {
            trigger_error("Post not found or of wrong type.");
        }
    }

    private function _refreshPost()
    {
        $this->_setBlog();
        $this->post = get_post($this->post_id);
        $this->_resetBlog();
    }

    private function _setBlog()
    {
        if (is_multisite()) {
            switch_to_blog($this->blog_id);
        }
    }

    private function _resetBlog()
    {
        if (is_multisite()) {
            restore_current_blog();
        }
    }

    private function _setMeta(string $key, string $value)
    {
        $this->_setBlog();
        return update_post_meta($this->post_id, $key, $value);
        $this->_resetBlog();
    }

    private function _getMeta(string $key)
    {
        $this->_setBlog();
        return get_post_meta($this->post_id, $key, true);
        $this->_resetBlog();
    }




    /*      GETTERS AND SETTERS      */

    /**
     * @return string The unique post ID.
     * 
     * This ID is unique across multisite installations.
     */
    function getUUID(): string
    {
        return $this->blog_id . "_" . $this->post_id;
    }

    static function fromUUID(string $uuid): popBot
    {
        [$blog_id, $post_id] = explode("_", $uuid);
        return new popBot($post_id, $blog_id);
    }

    function getPostID(): int
    {
        return $this->post_id;
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
        $this->_setBlog();

        $ret = wp_update_post([
            "ID" => $this->post_id,
            "post_title" => $title,
            "post_name" => sanitize_title($title)
        ]);

        $this->_resetBlog();

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

    function setTemplate(string $template)
    {
        return $this->_setMeta("template", $template);
    }

    function getTemplate(): string
    {
        return $this->_getMeta("template") ?: "native/box"; // Default template
    }

    function getTemplateObject(): template
    {
        return new template($this->getTemplate());
    }

    function setTrigger($trigger)
    {
        if (is_array($trigger)) $trigger = json_encode($trigger);

        return $this->_setMeta("trigger", $trigger);
    }

    function getTrigger(): string
    {
        return $this->_getMeta("trigger") ?: '{"trigger":"","threshold":""}';
    }

    function getTriggerArray(): array
    {
        return json_decode($this->getTrigger(), true);
    }

    function setConditions($conditions)
    {
        if (is_array($conditions)) $conditions = json_encode($conditions);

        return $this->_setMeta("conditions", $conditions);
    }

    function getConditions(): string
    {
        return $this->_getMeta("conditions") ?: "[]";
    }

    function getConditionsArray(): array
    {
        return json_decode($this->getConditions(), true);
    }

    function setVariantParent($variant_parent_id)
    {
        return $this->_setMeta("variant_parent", $variant_parent_id);
    }

    function getVariantParent(): string
    {
        return $this->_getMeta("variant_parent") ?: "0";
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

    function setVisibility($visibility)
    {
        if (is_array($visibility)) $visibility = json_encode($visibility);

        return $this->_setMeta("visibility", $visibility);
    }

    function getVisibility(): string
    {
        return $this->_getMeta("visibility") ?: '{ "visibility": "public", "start": null, "end": null }';
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
        $this->_setBlog();
        wp_set_post_terms($this->post_id, $tagIDs, popbotPlugin::TAGS_TAXONOMY, true);
        $this->_resetBlog();
    }

    function removeTag(...$tagIDs)
    {
        $this->_setBlog();
        wp_remove_object_terms($this->post_id, $tagIDs, popbotPlugin::TAGS_TAXONOMY);
        $this->_resetBlog();
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
        $this->_setBlog();
        return has_term($tagID, popbotPlugin::TAGS_TAXONOMY, $this->post_id);
        $this->_resetBlog();
    }

    function getTags()
    {
        $this->_setBlog();
        return get_the_terms($this->post_id, popbotPlugin::TAGS_TAXONOMY);
        $this->_resetBlog();
    }

    function getEditLink(): string
    {
        $this->_setBlog();
        $url = page::get("popbot-edit")->getLink();
        $this->_resetBlog();

        $url = add_query_arg([
            "post" => $this->post_id,
        ], $url);

        return $url;
    }

    function getShortcode(): string
    {
        $id = $this->getUUID();
        return "[popbot id='$id']";
    }





    /*      HELPERS      */

    /**
     * Creates an object that contains all a popBot's required info.
     */
    function getConstructorOptions()
    {
        return [
            "title"      => $this->getTitle(),
            "id"         => $this->getUUID(),
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
        $this->_setBlog();
        return wp_delete_post($this->post_id);
        $this->_resetBlog();
    }





    /*      RENDERING       */

    /**
     * Renders the popbot's HTML.
     */
    function render($classes = ""): void
    {
        $template = $this->getTemplateObject();

        $this->_setBlog();
        $content = $template->getHTML($this->post_id);
        $this->_resetBlog();

        $wrapper = "<div class='popbot-container $classes' id='%s' hidden inert>%s</div>";
        $html = sprintf($wrapper, $this->getUUID(), $content);

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

            'blog_id' => get_current_blog_id(),
            'variant_of' => '',
            'include_variants' => false,
            'ignore_multisite_sticky' => false,
            'is_multisite_sticky' => false,
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

        if ($args['is_multisite_sticky']) {
            static::addMetaQuery($args, [
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
            $bots[] = new popBot($post->ID);
        }


        if (!$args['ignore_multisite_sticky'] && is_multisite() && $args['blog_id'] !== get_main_site_id()) {
            // In multisite and not in the main site, get the sticky bots from the main site.
            $args['blog_id'] = get_main_site_id();
            $args['is_multisite_sticky'] = true;
            array_push($bots, ...static::query($args));
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
