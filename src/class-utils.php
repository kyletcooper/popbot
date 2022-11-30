<?php

namespace popbot;

class Utils
{
    static function add_meta_query(array $args, array $new_meta_query, string $relation = 'AND'): array
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
}
