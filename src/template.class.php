<?php

namespace popbot;

$popbotCurrentTemplate = null;

class template
{
    public string $slug;
    public array $details;

    const area_dirs = [
        "uploads" => [
            "dir" => popbotPlugin::CONTENT_DIR . '/templates',
            "uri" => popbotPlugin::CONTENT_URL . '/templates'
        ],
        "native" => [
            "dir" => popbotPlugin::PLUGIN_DIR . '/templates',
            "uri" => popbotPlugin::PLUGIN_URL . '/templates'
        ],
    ];

    function __construct(string $slug)
    {
        $this->slug = $slug;
        $this->details = $this->readDetails();
        $this->image = $this->getImageURL();
    }

    function getHTML($post_id = -1): string
    {
        if (!$this->getDir()) {
            return "";
        }

        ob_start();

        global $post;
        $post = get_post($post_id);
        setup_postdata($post_id);

        global $popbotCurrentTemplate;
        $popbotCurrentTemplate = $this;

        include $this->getDir("template.php");

        wp_reset_postdata();

        return ob_get_clean();
    }

    function getPath(string $area_type, string $append = "")
    {
        $split = explode("/", $this->slug, 2);

        $area_key = $split[0];
        $dir_name = $split[1];

        $area_path = static::area_dirs[$area_key][$area_type];
        $dir = trailingslashit($area_path) . $dir_name;

        if (!$append) return $dir;

        return trailingslashit($dir) . $append;
    }

    function getDir(string $append = "")
    {
        return $this->getPath("dir", $append);
    }

    function getURL(string $append = ""): string
    {
        return $this->getPath("uri", $append);
    }

    function hasFile(string $file_name): bool
    {
        return file_exists($this->getDir($file_name));
    }

    function getFile(string $file_name): string
    {
        return file_get_contents($this->getDir($file_name));
    }

    function hasSettings(): bool
    {
        return $this->hasFile("settings.php");
    }

    function includeSettings(): void
    {
        if ($this->hasSettings()) {
            include $this->getDir("settings.php");
        }
    }

    function hasCSS(): bool
    {
        return $this->hasFile("style.css");
    }

    function getCSS(): string
    {
        return $this->getFile("style.css");
    }

    function getCSSURL(): string
    {
        return $this->getURL("style.css");
    }

    function hasJS(): bool
    {
        return $this->hasFile("script.js");
    }

    function getJS(): string
    {
        return $this->getFile("script.js");
    }

    function getJSURL(): string
    {
        return $this->getURL("script.js");
    }

    function hasImage(): bool
    {
        return $this->hasFile("screenshot.png");
    }

    function getImage(): string
    {
        return $this->getFile("screenshot.png");
    }

    function getImageURL(): string
    {
        return $this->getURL("screenshot.png");
    }

    function enqueueAssets()
    {
        if ($this->hasCSS()) {
            wp_enqueue_style("popbot-style-" . $this->slug, $this->getCSSURL());
        }

        if ($this->hasJS()) {
            wp_enqueue_style("popbot-script-" . $this->slug, $this->getJSURL());
        }
    }

    function readDetails()
    {
        $json = $this->getFile("meta.json");
        $details = json_decode($json, true);
        $defaults = [
            "name" => "Unnamed Template",
            "version" => "1.0",
        ];

        if (!is_array($details)) return $defaults;

        return array_merge($defaults, $details);
    }

    static function getAll($allowed_area_keys = [])
    {
        $parts = [];

        if (!is_array($allowed_area_keys)) $allowed_area_keys = [$allowed_area_keys];
        if (!$allowed_area_keys) $allowed_area_keys = array_keys(static::area_dirs);

        foreach (static::area_dirs as $area_key => $areas) {
            if (!in_array($area_key, $allowed_area_keys)) continue;

            $files = array_diff(scandir($areas["dir"]), array('..', '.'));

            foreach ($files as $file_name) {
                $path = realpath(trailingslashit($areas["dir"]) . $file_name);

                if (!is_dir($path)) continue;

                $parts[] = new template($area_key . "/" . $file_name);
            }
        }

        return $parts;
    }

    static function getAllCategorised($allowed_area_keys = [])
    {
        $templates = static::getAll($allowed_area_keys);
        $categories = [];

        foreach ($templates as $template) {
            $cat = strtolower($template->details['category']);

            if (!$cat) {
                $cat = __("Uncategorised", "popbot");
            }

            if (!array_key_exists($cat, $categories)) {
                $categories[$cat] = [
                    "label" => $cat,
                    "items" => []
                ];
            }

            $categories[$cat]["items"][] = $template;
        }

        return $categories;
    }
}
