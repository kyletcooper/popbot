<?php

namespace popbot;

$popbotActions = [];

class action
{
    public string $name;
    public string $redirect_to;
    public string $capability;
    public array $run;

    /**
     * @param string            $name
     * @param string|page       $redirect_to   Defaults to admin dashboard if there is a capability, home page if not.
     * @param string            $capability    Defaults to popBotPlugin::CAPABILITY
     */
    function __construct(string $name, $redirect_to = "", string $capability = popbotPlugin::CAPABILITY)
    {
        $this->name = $name;
        $this->capability = $capability;
        $this->runs = [];

        // Different redirect inputs
        if (is_a($redirect_to, __NAMESPACE__ . "\\page")) {
            $this->redirect_to = $redirect_to->getLink();
        } else if ($redirect_to) {
            $this->redirect_to = $redirect_to;
        } else {
            $this->redirect_to = $capability ? admin_url() : home_url();
        }

        // Store
        global $popbotActions;
        $popbotActions[$this->name] = $this;

        // Hooks
        add_action("admin_action_$this->name", [$this, "_trigger"]);
        add_action("wp_ajax_$this->name", [$this, "_trigger"]);
        if (!$capability) add_action("wp_ajax_nopriv_$this->name", [$this, "_trigger"]);

        return $this;
    }

    function _trigger()
    {
        if (!current_user_can($this->capability)) {
            $this->fail(__("You don't have permission to perform this action.", 'popbot'));
        }

        if (!wp_verify_nonce($_REQUEST['_wpnonce'], $this->name)) {
            $this->fail(__("The link you followed has expired. Please refresh and try again.", 'popbot'));
        }

        foreach ($this->runs as $func) {
            if (is_callable($func)) {
                call_user_func($func, $this, $_REQUEST);
            }
        }
    }

    function run($function)
    {
        $this->runs[] = $function;
        return $this;
    }

    function response(bool $success, $data = [], string $redirect_to = '')
    {
        if (!$redirect_to) $redirect_to = $this->redirect_to;
        if (!is_array($data)) $data = ["msg" => $data, "redirect_to" => $redirect_to];

        if (wp_doing_ajax()) {
            $success ? wp_send_json_success($data) : wp_send_json_error($data);
        } else if ($this->redirect_to || $redirect_to) {
            $redirect_to = add_query_arg($data, $redirect_to);
            wp_redirect($redirect_to);
        }

        exit();
    }

    function succeed($data = [], string $redirect_to = '')
    {
        $this->response(true, $data, $redirect_to);
    }

    function fail($data = [], string $redirect_to = '')
    {
        $this->response(false, $data, $redirect_to);
    }

    function getAJAXNonce()
    {
        return wp_create_nonce($this->name);
    }

    function getLink(array $data = [])
    {
        $data = array_merge($data, [
            '_wpnonce' => wp_create_nonce($this->name),
            'action' => $this->name,
        ]);

        $url = admin_url("admin.php");
        $url = add_query_arg($data, $url);

        return $url;
    }

    function openForm(array $attrs = [])
    {
        $attrs = array_merge($attrs, [
            "method" => "POST",
            "action" => admin_url('admin.php'),
        ]);

        $attr_string = "";
        foreach ($attrs as $attr => $value) {
            $attr_string .= esc_attr($attr) . "='" . esc_attr($value) . "' ";
        }

        echo "<form $attr_string >";
        echo "<input type='hidden' name='action' value='$this->name'/>";
        wp_nonce_field($this->name);
    }

    function closeForm()
    {
        echo "</form>";
    }

    static function get(string $name)
    {
        global $popbotActions;

        if (array_key_exists($name, $popbotActions)) {
            return $popbotActions[$name];
        }

        return false;
    }

    static function getAll(): array
    {
        global $popbotActions;
        return $popbotActions;
    }
}
