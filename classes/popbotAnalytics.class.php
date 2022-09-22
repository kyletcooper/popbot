<?php

namespace popbot;

class popbotAnalytics
{
    static function getTableName(): string
    {
        global $wpdb;

        return $wpdb->prefix . "popbot_analytics";
    }

    static function createTable(): void
    {
        global $wpdb;

        $table_name = self::getTableName();
        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE IF NOT EXISTS $table_name (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            date datetime DEFAULT GETDATE() NOT NULL,
            event_type TEXT NOT NULL,
            post_id bigint(20) NOT NULL,
            PRIMARY KEY  (id)
        ) $charset_collate;";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }

    static function dropTable(): void
    {
        // Silence is golden.
    }

    /**
     * @return int|false The number of rows inserted, or false on error.
     */
    static function insertEvent(string $event_type, int $post_id)
    {
        global $wpdb;

        return $wpdb->insert(
            self::getTableName(),
            array(
                'event_type' => $event_type,
                'post_id' => $post_id,
            )
        );
    }

    private static function _sqlWhereSingleOrMultiple($key, $value): string
    {
        if (is_array($value)) {
            $value_commasep = implode(", ", $value);
            return "$key IN $value_commasep";
        }

        return "$key = '$value'";
    }

    private static function _sqlWhereDate($key, $start, $end): string
    {
        // Format
        $timestamp_format = "Y-m-d H:i:s";

        if (!$start) {
            $start = 0;
        } else if (!is_int($start)) {
            $start = strtotime($start);
        }

        if (!$end) {
            $end = time();
        } else if (!is_int($end)) {
            $end = strtotime($end);
        }

        $start_formatted = date($timestamp_format, $start);
        $end_formatted = date($timestamp_format, $end);

        return "$key BETWEEN '$start_formatted' AND '$end_formatted'";
    }

    static private function _sqlFormatColumns($columns)
    {
        if (!$columns) {
            return "*";
        }

        if (is_array($columns)) {
            return "('" . implode("', '", $columns) . "')";
        }

        return $columns;
    }

    static private function _sqlSelect(array $opts = [])
    {
        global $wpdb;

        // Input
        $opts = array_merge([
            "columns" => "*",
            "group" => false,
            "orderby" => "id",
            "order" => "DESC",

            "post_id" => false,
            "event_type" => false,
            "date_start" => false,
            "date_end" => false,
        ], $opts);


        // Construct WHERE clause
        $wheres = [];

        if ($opts['post_id']) {
            var_dump($opts);
            $wheres[] = static::_sqlWhereSingleOrMultiple("post_id", $opts['post_id']);
        }

        if ($opts['event_type']) {
            $wheres[] = static::_sqlWhereSingleOrMultiple("event_type", $opts['event_type']);
        }

        if ($opts['date_start'] || $opts['date_end']) {
            $wheres[] = static::_sqlWhereDate("date", $opts['date_start'], $opts['date_end']);
        }


        // Construct statement
        // Columns
        $table_name = static::getTableName();
        $columns_formatted = static::_sqlFormatColumns($opts['columns']);
        $sql = "SELECT $columns_formatted FROM $table_name";

        // Where
        if ($wheres) {
            $sql .= " WHERE " . implode(" AND ", $wheres);
        }

        // Group
        if ($opts['group']) {
            $sql .= " GROUP BY " . $opts['group'];
        }

        // Order
        if ($opts['orderby']) {
            $sql .= " ORDER BY " . $opts['orderby'] . " " . $opts['order'];
        }

        $sql .= ";";

        return $sql;
    }

    static function getEvents(array $opts = [])
    {
        global $wpdb;

        $opts["columns"] = "*";
        $sql = static::_sqlSelect($opts);

        return $wpdb->get_results($sql, ARRAY_A);
    }

    static function getEventsCount(array $opts = [])
    {
        global $wpdb;

        $opts["columns"] = "COUNT(*) as count";
        $sql = static::_sqlSelect($opts);

        return $wpdb->get_var($sql);
    }

    static function getEventsPlot(array $opts = [])
    {
        global $wpdb;

        $opts["columns"] = "COUNT(id) AS count, DATE(date) AS day";
        $opts["group"] = "day";
        $opts["orderby"] = "day";

        $sql = static::_sqlSelect($opts);

        return $wpdb->get_results($sql, ARRAY_A);
    }
}
