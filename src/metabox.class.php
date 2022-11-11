<?php

namespace popbot;

class Popbot_Metabox
{
    private static $instance = null;

    /**
     * Returns the singleton instance of the class.
     */
    public static function get_instance()
    {
        if (self::$instance == null) {
            self::$instance = new static();
        }

        return self::$instance;
    }

    private function __construct()
    {
        add_action('save_post', [$this, 'save'], 10, 2);

        add_action('add_meta_boxes', function () {
            add_meta_box("popbot", __("Template Settings", 'popbot'), [$this, 'render_metabox'], popbotPlugin::POST_TYPE, 'side', 'high');
        });
    }


    public static function get_settings($post): array
    {
        $default_settings = [];

        $popbot = new popBot($post->ID);
        $popbot->getTemplateObject()->includeSettings();

        return apply_filters("popbot_template_settings", $default_settings);
    }

    public function render_metabox($post): void
    {
        echo "<div class='pb_metabox'>";

        wp_nonce_field("pb_save_metabox", 'pb_nonce');

        foreach (static::get_settings($post) as $input) {
            $this->render_input($post, $input);
        }

        echo "</div>";
    }

    private function render_input($post, $input): void
    {
        $input = array_merge([
            "slug" => "",
            "name" => "",
            "type" => "text",
            "default" => "",
            "help" => "",
            "_core" => false,
        ], $input);

        $special_inputs = [
            "image",
            "select",
            "position",
            "background-size",
            "slider",
        ];

        $input['value'] = $input['default'];
        $noValue = true;

        if (metadata_exists("post", $post->ID, $input['slug'])) {
            $input['value'] = get_post_meta($post->ID, $input['slug'], true);
            $noValue = false;
        }
?>

        <section class="pb_metabox__field pb_metabox__field--<?php esc_attr_e($input['type']) ?> pb_metabox__field--<?php esc_attr_e($input['slug']) ?> <?php echo $noValue ? "pb_metabox__field--none" : ""; ?> <?php echo $input['value'] == $input['default'] ? "pb_metabox__field--default" : ""; ?>" data-pbmetabox>
            <label class="pb_metabox__label" for="<?php esc_attr_e($input['slug']) ?>"><?php esc_html_e($input['name']) ?></label>

            <?php

            if (in_array($input['type'], $special_inputs)) {
                $this->render_special_input($input);
            } else {
                $this->render_default_input($input);
            }

            ?>

            <?php if ($input['help']) : ?>
                <p class="pb_metabox__help"><?php esc_html_e($input['help']) ?></p>
            <?php endif; ?>
        </section>

    <?php
    }

    private function render_default_input($input)
    {
    ?>
        <input class="pb_metabox__input" id="<?php esc_attr_e($input['slug']) ?>" type='<?php esc_attr_e($input['type']) ?>' name='<?php esc_attr_e($input['slug']) ?>' value='<?php esc_attr_e($input['value']); ?>' />
        <?php
    }

    private function render_special_input($input)
    {
        switch ($input['type']) {
            case "image":
        ?>
                <div class="pb_metabox__mediaPicker">
                    <input class="pb_metabox__mediaPicker__input" type="hidden" name='<?php esc_attr_e($input['slug']) ?>' value='<?php esc_attr_e($input['value']); ?>' />
                    <label for="<?php esc_attr_e($input['slug']) ?>" class="pb_metabox__mediaPicker__preview" style=" background-image: url('<?php esc_attr_e(wp_get_attachment_image_url($input['value'], "large")) ?>')"></label>
                    <button class="pb_metabox__mediaPicker__choose components-button is-primary" type="button" id="<?php esc_attr_e($input['slug']) ?>"><?php _e("Select an Image", 'popbot') ?></button>
                    <button class="pb_metabox__mediaPicker__remove components-button is-destructive is-link" type="button"><?php _e("Remove Image", 'popbot') ?></button>
                </div>
            <?php
                break;

            case "select":
            ?>
                <select class="pb_metabox__select" id="<?php esc_attr_e($input['slug']) ?>" name='<?php esc_attr_e($input['slug']) ?>'>
                    <?php foreach ($input["options"] as $key => $label) : ?>
                        <option value="<?php esc_attr_e($key) ?>" <?php if ($key == $input['value']) echo "selected" ?>><?php esc_html_e($label) ?></option>
                    <?php endforeach; ?>
                </select>
            <?php
                break;

            case "position":
                $positions = ["top left", "top center", "top right", "center left", "center center", "center right", "bottom left", "bottom center", "bottom right"];
                $isPreset = in_array($input['value'], $positions);
            ?>
                <div class="pb_metabox__positionPicker">
                    <button class="pb_metabox_controls" data-pbmetabox-presets-toggle="<?php echo $isPreset ? "true" : "false"; ?>">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="11.9" viewBox="0 0 14 11.9">
                            <path id="Path_577" data-name="Path 577" d="M13.188,12.725a2.153,2.153,0,0,0-2.1,1.575H4v1.225h7.087a2.261,2.261,0,0,0,2.1,1.575,2.153,2.153,0,0,0,2.1-1.575H18V14.213H15.287A2.183,2.183,0,0,0,13.188,12.725Zm-2.275-5.95A2.261,2.261,0,0,0,8.813,5.2a2.261,2.261,0,0,0-2.1,1.575H4V8.087H6.712a2.261,2.261,0,0,0,2.1,1.575,2.153,2.153,0,0,0,2.1-1.575H18V6.775Z" transform="translate(-4 -5.2)" />
                        </svg>
                    </button>

                    <div class="pb_metabox__positionPicker__presets" data-pbmetabox-presets="true">
                        <?php foreach ($positions as $position) : ?>
                            <label class="pb_metabox__positionPicker__label">
                                <input class="pb_metabox__positionPicker__input" type="radio" name="<?php esc_attr_e($input['slug']) ?>" value="<?php esc_attr_e($position) ?>" <?php if ($position == $input['value']) echo "checked"; ?>>
                                <div class="pb_metabox__positionPicker__block"></div>
                            </label>
                        <?php endforeach; ?>
                    </div>

                    <div class="pb_metabox__positionPicker__custom" data-pbmetabox-presets="false">
                        <input class="pb_metabox__input" type='text' name='<?php esc_attr_e($input['slug']) ?>' value='<?php $isPreset ? null : esc_attr_e($input['value']); ?>' />
                    </div>
                </div>
            <?php
                break;

            case "background-size":
                $presets = [
                    'cover' => __('Cover', 'popbot'),
                    'contain' => __('Contain', 'popbot'),
                ];

                $isPreset = array_key_exists($input['value'], $presets);
            ?>
                <div class="pb_metabox__bgSize">
                    <button class="pb_metabox_controls" data-pbmetabox-presets-toggle="<?php echo $isPreset ? "true" : "false"; ?>">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="11.9" viewBox="0 0 14 11.9">
                            <path id="Path_577" data-name="Path 577" d="M13.188,12.725a2.153,2.153,0,0,0-2.1,1.575H4v1.225h7.087a2.261,2.261,0,0,0,2.1,1.575,2.153,2.153,0,0,0,2.1-1.575H18V14.213H15.287A2.183,2.183,0,0,0,13.188,12.725Zm-2.275-5.95A2.261,2.261,0,0,0,8.813,5.2a2.261,2.261,0,0,0-2.1,1.575H4V8.087H6.712a2.261,2.261,0,0,0,2.1,1.575,2.153,2.153,0,0,0,2.1-1.575H18V6.775Z" transform="translate(-4 -5.2)" />
                        </svg>
                    </button>

                    <div class="pb_metabox__bgSize__presets" data-pbmetabox-presets="true">
                        <?php foreach ($presets as $value => $label) : ?>
                            <label class="pb_metabox__bgSize__label">
                                <input class="pb_metabox__bgSize__input" type="radio" name="<?php esc_attr_e($input['slug']) ?>" value="<?php esc_attr_e($value) ?>" <?php if ($value == $input['value']) echo "checked"; ?>>
                                <div class="pb_metabox__bgSize__block"><?php esc_html_e($label) ?></div>
                            </label>
                        <?php endforeach; ?>
                    </div>

                    <div class="pb_metabox__bgSize__custom" data-pbmetabox-presets="false">
                        <input class="pb_metabox__input" type='text' name='<?php esc_attr_e($input['slug']) ?>' value='<?php $isPreset ? null : esc_attr_e($input['value']); ?>' />
                    </div>
                </div>
            <?php
                break;

            case "slider":
            ?>
                <div class="pb_slider" data-pbslider="parent">
                    <input data-pbslider="slider" class="pb_slider__range" type="range" min="<?php esc_attr_e($input['min'] ?? 0) ?>" max="<?php esc_attr_e($input['max'] ?? 100) ?>" value="<?php esc_attr_e($input['value']) ?>">
                    <input data-pbslider="input" class="pb_slider__input pb_metabox__input" type="number" min="<?php esc_attr_e($input['min'] ?? 0) ?>" max="<?php esc_attr_e($input['max'] ?? 100) ?>" value="<?php esc_attr_e($input['value']) ?>" name="<?php esc_attr_e($input['slug']) ?>">
                </div>
<?php
                break;
        }
    }

    public function save($post_id, $post): void
    {
        $nonce_action = "pb_save_metabox";
        $nonce_key = "pb_nonce";
        if (!isset($_POST[$nonce_key]) || !wp_verify_nonce($_POST[$nonce_key], $nonce_action)) return;

        // Capabilities
        $post_type = get_post_type_object($post->post_type);
        if (!current_user_can($post_type->cap->edit_post, $post_id)) return;

        // Save
        $inputs = static::get_settings($post);

        foreach ($inputs as $input) {
            $key = $input['slug'];
            $old_value = get_post_meta($post_id, $key, true);
            $new_value = sanitize_text_field($_POST[$key]) ?? '';

            if ($new_value && $new_value != $old_value) {
                update_post_meta($post_id, $key, $new_value);
            } elseif ('' == $new_value && $old_value) {
                delete_post_meta($post_id, $key, $old_value);
            }
        }
    }
}
