<?php

namespace popbot;

class Popbot_Analytics
{

    const ANALYTICS_EVENTS = array('shown', 'converted', 'dismissed');
    const APPROVED_COLUMNS = array('id', 'date', 'event_type', 'post_id', 'day'); // Day is special case for plots

    private static function switch_blog(): void
    {
        if (is_multisite()) {
            switch_to_blog(get_main_site_id());
        }
    }

    private static function reset_blog(): void
    {
        if (is_multisite()) {
            restore_current_blog();
        }
    }

    public static function get_table_name(): string
    {
        global $wpdb;

        return $wpdb->prefix . 'popbot_analytics';
    }

    public static function create_table(): void
    {
        global $wpdb;
        static::switch_blog();

        $table_name      = self::get_table_name();
        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE IF NOT EXISTS $table_name (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            date datetime DEFAULT GETDATE() NOT NULL,
            event_type TEXT NOT NULL,
            post_id bigint(20) NOT NULL,
            PRIMARY KEY  (id)
        ) $charset_collate;";

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta($sql);

        static::reset_blog();
    }

    public static function drop_table(): void
    {
        global $wpdb;
        static::switch_blog();

        $table_name = self::get_table_name();
        $sql        = "DROP TABLE IF EXISTS $table_name";
        $wpdb->query($sql); // phpcs:ignore -- This is a custom table we need to directly call the database.

        static::reset_blog();
    }

    /**
     * @return int|false The number of rows inserted, or false on error.
     */
    public static function insert_event(string $event_type, string $popbot_uuid, string $url)
    {
        if (!in_array($event_type, static::ANALYTICS_EVENTS, true)) {
            return false;
        }

        global $wpdb;
        static::switch_blog();

        $result = $wpdb->insert(  // phpcs:ignore -- This is a custom table we need to directly call the database.
            self::get_table_name(),
            array(
                'event_type' => $event_type,
                'post_id'    => $popbot_uuid,
            )
        );

        static::reset_blog();
        return $result;
    }

    private static function sql_validate_column(string $column, string $fallback = 'event_type')
    {
        if (in_array($column, static::APPROVED_COLUMNS, true)) {
            return $column;
        }

        if (in_array($fallback, static::APPROVED_COLUMNS, true)) {
            return $fallback;
        }

        return 'event_type';
    }

    private static function sql_where_single_or_multiple($key, $value, array &$args): string
    {
        if (!is_array($value)) {
            $value = array($value);
        }

        $str = static::sql_validate_column($key) . ' IN (';

        foreach ($value as $i => $val) {
            if ($i !== 0) {
                $str .= ',';
            }
            $str   .= '%s';
            $args[] = $val;
        }

        return $str . ')';
    }

    private static function sql_where_date($key, $start, $end, &$args): string
    {
        // Format
        $timestamp_format = 'Y-m-d H:i:s';

        if (!$start) {
            $start = 0;
        } elseif (!is_int($start)) {
            $start = strtotime($start);
        }

        if (!$end) {
            $end = time();
        } elseif (!is_int($end)) {
            $end = strtotime($end);
        }

        $args[] = date($timestamp_format, $start);
        $args[] = date($timestamp_format, $end);
        return static::sql_validate_column($key) . ' BETWEEN %s AND %s';
    }

    private static function sql_select(string $columns, array $opts = array())
    {
        global $wpdb;

        // Input
        $opts = array_merge(
            array(
                'group'      => false,
                'orderby'    => 'id',
                'order'      => 'DESC',

                'post_id'    => false,
                'event_type' => false,
                'date_start' => false,
                'date_end'   => false,
            ),
            $opts
        );

        // Construct WHERE clause
        $wheres = array();
        $args   = array();

        if ($opts['post_id']) {
            $wheres[] = static::sql_where_single_or_multiple('post_id', $opts['post_id'], $args);
        }

        if ($opts['event_type']) {
            $wheres[] = static::sql_where_single_or_multiple('event_type', $opts['event_type'], $args);
        }

        if ($opts['date_start'] || $opts['date_end']) {
            $wheres[] = static::sql_where_date('date', $opts['date_start'], $opts['date_end'], $args);
        }

        // Construct statement
        // Columns
        // Columns are only ever sent by an internal function so they can be trusted.
        $table_name = static::get_table_name();
        $sql        = "SELECT $columns FROM $table_name";

        // Where
        if ($wheres) {
            $sql .= ' WHERE ' . implode(' AND ', $wheres);
        }

        // Group
        if ($opts['group']) {
            $group = static::sql_validate_column($opts['group']);
            $sql  .= " GROUP BY $group";
        }

        // Order
        if ($opts['orderby']) {
            $orderby = static::sql_validate_column($opts['orderby']);
            $order   = strtolower($opts['order']) === 'asc' ? 'ASC' : 'DESC';
            $sql    .= " ORDER BY $orderby $order";
        }

        $sql     .= ';';
        $prepared = $wpdb->prepare($sql, $args);
        return $prepared;
    }

    public static function get_events(array $opts = array())
    {
        global $wpdb;
        static::switch_blog();

        $sql    = static::sql_select('*', $opts);
        $result = $wpdb->get_results($sql, ARRAY_A);  // phpcs:ignore -- This is a custom table we need to directly call the database.

        static::reset_blog();
        return $result;
    }

    public static function get_event_count(array $opts = array())
    {
        global $wpdb;
        static::switch_blog();

        $sql    = static::sql_select('COUNT(*) as count', $opts);
        $result = $wpdb->get_var($sql);  // phpcs:ignore -- This is a custom table we need to directly call the database.

        static::reset_blog();
        return $result;
    }

    public static function get_event_plot(array $opts = array())
    {
        global $wpdb;
        static::switch_blog();

        $opts['group']   = 'day';
        $opts['orderby'] = 'day';

        $sql    = static::sql_select('COUNT(id) AS count, DATE(date) AS day', $opts);
        $result = $wpdb->get_results($sql, ARRAY_A);  // phpcs:ignore -- This is a custom table we need to directly call the database.

        static::reset_blog();
        return $result;
    }
}
