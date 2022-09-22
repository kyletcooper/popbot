<?php

namespace popbot;

class popBot
{
    const ANALYTICS_EVENTS = ["shown", "converted", "dismissed"];

    private int $post_id;
    private \WP_Post $post;

    /**
     * Creates a popBot instance.
     */
    function __construct(int $post_id)
    {
        $this->post_id = $post_id;
        $this->post = get_post($post_id);
    }

    private function _refreshPost()
    {
        $this->post = get_post($this->post_id);
    }




    /*      GETTERS AND SETTERS      */

    /**
     * @return string The unique post ID.
     */
    function getID(): int
    {
        return $this->post_id;
    }

    /**
     * @return string The unique post slug.
     */
    function getSlug(): string
    {
        return $this->post->post_name;
    }

    /**
     * @return int|WP_Error The post ID on success. The value 0 or WP_Error on failure.
     */
    function setSlug(string $slug)
    {
        $ret = wp_update_post([
            "ID" => $this->post_id,
            "post_name" => $slug
        ]);

        $this->_refreshPost();

        return $ret;
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
            "post_title" => $title
        ]);

        $this->_refreshPost();

        return $ret;
    }

    /**
     * @return string The post status.
     */
    function getStatus(): string
    {
        return $this->post->post_status;
    }

    /**
     * @return int|WP_Error The post ID on success. The value 0 or WP_Error on failure.
     */
    function setStatus(string $status)
    {
        $ret = wp_update_post([
            "ID" => $this->post_id,
            "post_status" => $status
        ]);

        $this->_refreshPost();

        return $ret;
    }

    function isEnabled()
    {
        return $this->getStatus() == "publish";
    }

    /**
     * @return int|WP_Error The post ID on success. The value 0 or WP_Error on failure.
     * 
     * @see setStatus
     */
    function enable()
    {
        return $this->setStatus("publish");
    }

    /**
     * @return int|WP_Error The post ID on success. The value 0 or WP_Error on failure.
     * 
     * @see setStatus
     */
    function disable()
    {
        return $this->setStatus("draft");
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
        return get_post_meta($this->post_id, "template", true) ?: "chatbox.php"; // Default template
    }

    function getTemplateObject(): popbotTemplate
    {
        return new popbotTemplate($this->getTemplate());
    }

    function getTemplateSettings(): string
    {
        return get_post_meta(get_the_ID(), "template_settings", true) ?: "{}";
    }

    function getTemplateSettingsArray(): array
    {
        return json_decode($this->getTemplateSettings(), true);
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

    function getEditLink(): string
    {
        return admin_url('admin.php?page=popbot-edit&post=' . $this->post_id);
    }



    /*      ANALYTICS     */

    /**
     * Records an analytics event.
     */
    function addAnalyticsEvent(string $event): bool
    {
        if (!in_array($event, static::ANALYTICS_EVENTS)) return false;

        return popbotAnalytics::insertEvent($event, $this->post_id);
    }





    /*      HELPERS      */

    /**
     * Creates an object that contains all a popBot's required info.
     */
    function getConstructorOptions()
    {
        return [
            "title"      => $this->getTitle(),
            "id"         => $this->getSlug(),
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

        if (!$this->isEnabled()) {
            $errors[] = __("PopBot is disabled.", 'popbot');
        }

        return $errors;
    }





    /*      RENDERING       */

    /**
     * Renders the popbot's HTML.
     */
    function render(): void
    {
        // Use the post slug as the element ID.

        $slug = $this->getSlug();
        $template = $this->getTemplateObject();
        $content = $template->getHTML($this->post_id);

        $wrapper = "<div class='popbot-container' id='%s' hidden inert>%s</div>";

        $html = sprintf($wrapper, $slug, $content);

        echo $html;
    }





    /*      CONDITIONS     */

    /**
     * Returns an array of popBots.
     * 
     * @return array Array of popBot Objects.
     */
    static function query(array $args = []): array
    {
        $default_args = [
            "post_type" => popbotPlugin::POST_TYPE
        ];

        $args = array_merge($default_args, $args);
        $posts = get_posts($args);
        $bots = [];

        foreach ($posts as $post) {
            $bots[] = new popBot($post->ID);
        }

        return $bots;
    }

    /**
     * Gets a PopBot by it's slug.
     */
    static function getBySlug(string $slug)
    {
        $post = get_page_by_path($slug, OBJECT, popbotPlugin::POST_TYPE);

        if (!$post) return null;

        return new PopBot($post->ID);
    }

    static function create(string $title = ""): popBot
    {
        if (!$title) {
            $title = "Untitled PopBot";
        }

        $id = wp_insert_post([
            "post_title" => $title,
            "post_type" => popbotPlugin::POST_TYPE
        ]);

        return new popBot($id);
    }
}
