<?php

namespace popbot;

class popbotTemplate
{
    /**
     * @var string Name of the part filename. Includes extension but not path.
     */
    public string $part_name;
    public string $path;
    public array $details;

    function __construct($part_name)
    {
        $this->part_name = $part_name;
        $this->path = static::locateFile($part_name);
        $this->details = static::readDetails($this->path);
    }

    function getHTML($post_id = -1): string
    {
        if (!$this->path) {
            return "";
        }

        ob_start();

        global $post;
        $post = get_post($post_id);
        setup_postdata($post_id);

        include $this->path;

        wp_reset_postdata();

        return ob_get_clean();
    }

    function getSettings()
    {
        global $popbot_settings;
        $popbot_settings = [];

        $this->getHTML(-1);

        return $popbot_settings;
    }

    static function readDetails($path)
    {
        return get_file_data($path, [
            "name" => "Name",
            "version" => "Version",

            "type" => "Type",
            "category" => "Category",
            "position" => "Position",

            "author" => "Author",
            "author_uri" => "Author URI",

            "license" => "License",
            "license_uri" => "License URI",
        ]);
    }

    /**
     * 
     * Part names are sanitized securely.
     * 
     * @param array|string $part_names
     */
    static function locateFile($part_names): string
    {
        if (!is_array($part_names)) $part_names = [$part_names];

        foreach ($part_names as $part_name) {
            foreach (popbotPlugin::TEMPLATES_DIRS as $dir) {
                $part_path = realpath($dir . $part_name);

                if (substr($part_path, 0, strlen($dir)) != $dir) {
                    // There's something dogy with the part name using relative paths.
                    continue;
                }

                if (!file_exists($part_path)) {
                    continue;
                }

                return $part_path;
            }
        }

        return "";
    }

    static function getAll()
    {
        $parts = [];

        foreach (popbotPlugin::TEMPLATES_DIRS as $dir) {
            if (!is_dir($dir)) continue;

            $files = array_diff(scandir($dir), array('..', '.'));

            foreach ($files as $part_name) {
                $parts[] = new popbotTemplate($part_name);
            }
        }

        return $parts;
    }
}
