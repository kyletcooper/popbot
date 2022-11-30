<?php

namespace popbot;

$popbotCurrentTemplate = null;

class Popbot_Template
{
    public string $slug;
    public array $details;
    public string $image;
    public string $css;
    public string $js;
    public string $preview;

    const area_dirs = [
        'uploads' => [
            'dir' => Popbot_Plugin::CONTENT_DIR . '/templates',
            'uri' => Popbot_Plugin::CONTENT_URL . '/templates'
        ],
        'native' => [
            'dir' => Popbot_Plugin::PLUGIN_DIR . '/templates',
            'uri' => Popbot_Plugin::PLUGIN_URL . '/templates'
        ],
    ];

    function __construct(string $slug)
    {
        $this->slug = $slug;
        $this->details = $this->read_details();
        $this->image = $this->get_image_url();
        $this->css = $this->get_css_url();
        $this->js = $this->get_js_url();
        $this->preview = $this->get_preview_url();
    }

    function get_slug(): string
    {
        return $this->slug;
    }

    function get_html($post_id = -1): string
    {
        if (!$this->get_dir()) {
            return '';
        }

        ob_start();

        global $post;
        $post = get_post($post_id);
        setup_postdata($post_id);

        global $popbotCurrentTemplate;
        $popbotCurrentTemplate = $this;

        include $this->get_dir('template.php');

        wp_reset_postdata();

        return ob_get_clean();
    }

    function get_path(string $area_type, string $append = '')
    {
        $split = explode('/', $this->slug, 2);

        $area_key = $split[0];
        $dir_name = $split[1];

        $area_path = static::area_dirs[$area_key][$area_type];
        $dir = trailingslashit($area_path) . $dir_name;

        if (!$append) return $dir;

        return trailingslashit($dir) . $append;
    }

    function get_dir(string $append = '')
    {
        return $this->get_path('dir', $append);
    }

    function get_url(string $append = ''): string
    {
        return $this->get_path('uri', $append);
    }

    function has_file(string $file_name): bool
    {
        return file_exists($this->get_dir($file_name));
    }

    function get_file(string $file_name): string
    {
        return file_get_contents($this->get_dir($file_name));
    }

    function has_settings(): bool
    {
        return $this->has_file('settings.php');
    }

    function include_settings(): void
    {
        if ($this->has_settings()) {
            include $this->get_dir('settings.php');
        }
    }

    function has_css(): bool
    {
        return $this->has_file('style.css');
    }

    function get_css(): string
    {
        return $this->get_file('style.css');
    }

    function get_css_url(): string
    {
        return $this->get_url('style.css');
    }

    function has_js(): bool
    {
        return $this->has_file('script.js');
    }

    function get_js(): string
    {
        return $this->get_file('script.js');
    }

    function get_js_url(): string
    {
        return $this->get_url('script.js');
    }

    function has_image(): bool
    {
        return $this->has_file('screenshot.png');
    }

    function get_image(): string
    {
        return $this->get_file('screenshot.png');
    }

    function get_image_url(): string
    {
        return $this->get_url('screenshot.png');
    }

    function get_preview_url(int $post_id = -1, int $scale = 1): string
    {
        return home_url() . "/popBotPreview?post=$post_id&scale=$scale";
    }

    function enqueue_assets()
    {
        if ($this->has_css()) {
            wp_enqueue_style('popbot-style-' . $this->slug, $this->get_css_url());
        }

        if ($this->has_js()) {
            wp_enqueue_style('popbot-script-' . $this->slug, $this->get_js_url());
        }
    }

    function read_details()
    {
        $json = $this->get_file('meta.json');
        $details = json_decode($json, true);
        $defaults = [
            'name' => 'Unnamed Template',
            'version' => '1.0',
            'category' => '',
        ];

        if (!is_array($details)) return $defaults;

        return array_merge($defaults, $details);
    }

    static function get($slug)
    {
        $template = new Popbot_Template($slug);

        if (!file_exists($template->get_dir())) {
            return new \WP_Error("missing_template", __("Template does not exist with slug: $slug.", 'popbot'));
        }

        return $template;
    }

    static function get_all($allowed_area_keys = [])
    {
        $parts = [];

        if (!is_array($allowed_area_keys)) $allowed_area_keys = [$allowed_area_keys];
        if (!$allowed_area_keys) $allowed_area_keys = array_keys(static::area_dirs);

        foreach (static::area_dirs as $area_key => $areas) {
            if (!in_array($area_key, $allowed_area_keys)) continue;

            $files = array_diff(scandir($areas['dir']), array('..', '.'));

            foreach ($files as $file_name) {
                $path = realpath(trailingslashit($areas['dir']) . $file_name);

                if (!is_dir($path)) continue;

                $parts[] = new Popbot_Template($area_key . '/' . $file_name);
            }
        }

        return $parts;
    }

    static function get_all_categorised($allowed_area_keys = [])
    {
        $templates = static::get_all($allowed_area_keys);
        $categories = [];

        foreach ($templates as $template) {
            $cat = strtolower($template->details['category']);

            if (!$cat) {
                $cat = __('Uncategorised', 'popbot');
            }

            if (!array_key_exists($cat, $categories)) {
                $categories[$cat] = [
                    'label' => $cat,
                    'items' => []
                ];
            }

            $categories[$cat]['items'][] = $template;
        }

        return $categories;
    }

    static function query(array $args = [])
    {
        $args = array_merge([
            'page' => 1,
            'per_page' => 20,
            'category' => '',
        ], $args);

        $templates = static::get_all();

        if ($args['per_page'] > 0) {
            $total = count($templates);
            $perPage = intval($args['per_page']);
            $page = intval($args['page']);
            $maxPages = floor($total / $perPage);

            $page = min(max($page, 0), $maxPages);
            $offset = max(($page - 1) * $perPage, 0);

            $templates = array_slice($templates, $offset, $perPage);
        }

        if ($args['category']) {
            $templates = array_filter($templates, function ($template) use ($args) {
                $cat = strtolower($template->details['category']);
                $catSearch = strtolower($args['category']);
                return $cat == $catSearch;
            });
        }

        return array_values($templates); // Reset keys
    }

    static function create($file_handler): Popbot_Template
    {
        // NOT IMPLEMENTED.
        return new Popbot_Template("native/box");
    }
}
