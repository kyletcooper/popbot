<?php

namespace popbot;

class Custom_Condition
{
    const POST_TYPE = 'popbot_condition';

    private int $post_id;
    private \WP_Post $post;

    public function __construct(int $post_id)
    {
        $this->post_id = $post_id;
        $this->_update_internal_post();
    }

    private function _update_internal_post()
    {
        static::_set_blog();

        $this->post = get_post($this->post_id);

        static::_reset_blog();
    }

    public function get_id(): int
    {
        return $this->post_id;
    }

    public function get_title(): string
    {
        return $this->post->post_title;
    }

    public function set_title(string $title): bool
    {
        static::_set_blog();

        $id = wp_update_post([
            "ID" => $this->get_id(),
            "post_title" => $title
        ]);

        static::_reset_blog();

        $this->_update_internal_post();
        return $id > 0;
    }

    public function get_callback(): string
    {
        return $this->post->post_content;
    }

    public function set_callback(string $callback): bool
    {
        static::_set_blog();

        $id = wp_update_post([
            "ID" => $this->get_id(),
            "post_content" => $callback
        ]);

        static::_reset_blog();

        $this->_update_internal_post();
        return $id > 0;
    }

    public function delete(): bool
    {
        return (bool) wp_delete_post($this->post_id);
    }

    private static function _set_blog()
    {
        if (is_multisite()) {
            switch_to_blog(get_main_site_id());
        }
    }

    private static function _reset_blog()
    {
        if (is_multisite()) {
            restore_current_blog();
        }
    }

    public static function init()
    {
        add_action('init', [static::class, 'register_post_type']);
    }

    public static function register_post_type()
    {
        register_post_type(static::POST_TYPE, [
            'label'                 => __('Custom Conditions', 'popbot'),
            'supports'              => ['title', 'editor', 'revisions'],
            'public'                => false,
            'can_export'            => true,
            'has_archive'           => false,
            'show_in_rest'          => true,
        ]);
    }

    public static function create(array $args = [])
    {
        static::_set_blog();

        $args = array_merge([
            'title' => 'Untitled Custom Condition',
            'callback' => 'return 1;',
        ]);

        $post_id = wp_insert_post([
            'post_title' => $args['title'],
            'post_name' => sanitize_title($args['title']),
            'post_content' => $args['callback'],
            'post_type' => static::POST_TYPE,
            'post_status' => 'publish',
        ]);

        $condition = new Custom_Condition($post_id);

        static::_reset_blog();
        return $condition;
    }

    public static function query(array $args = [])
    {
        static::_set_blog();

        $default_args = [
            'per_page' => -1,
            'page' => 1,
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

        $posts = get_posts($args);
        $conditions = [];

        foreach ($posts as $post) {
            $conditions[] = new Custom_Condition($post->ID);
        }

        static::_reset_blog();
        return $conditions;
    }
}
