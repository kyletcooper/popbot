// const defaultGutenbergConfig = require("@wordpress/scripts/config/webpack.config");
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const IgnoreEmitPlugin = require('ignore-emit-webpack-plugin');
const path = require('path');
// var glob = require('glob');


var public = {
    mode: "production",
    watch: true,

    entry: path.resolve(__dirname, 'assets/scripts/src/public.js'),

    output: {
        filename: 'public.js',
        path: path.resolve(__dirname, 'assets/scripts/dist/'),
    },
};


var admin = {
    mode: "production",
    watch: true,

    entry: path.resolve(__dirname, 'assets/scripts/src/admin.js'),

    output: {
        filename: 'admin.js',
        path: path.resolve(__dirname, 'assets/scripts/dist/'),
    },
};


var editor = {
    mode: "production",
    watch: true,

    entry: path.resolve(__dirname, 'assets/scripts/src/editor.js'),

    output: {
        filename: 'editor.js',
        path: path.resolve(__dirname, 'assets/scripts/dist/'),
    },
};


// var gutenbergConfig = {
//     ...defaultGutenbergConfig,

//     watch: true,

//     entry: {
//         index: path.resolve('./blocks/condition/index.js'),
//         style: path.resolve('./blocks/condition/style.css'),
//         editor: path.resolve('./blocks/condition/editor.css'),
//     },

//     output: {
//         path: path.resolve(__dirname, 'blocks/dist/'),
//     },

//     plugins: [
//         ...defaultGutenbergConfig.plugins,

//         new MiniCssExtractPlugin({
//             filename: '[name].css',
//         }),

//         new IgnoreEmitPlugin(['editor.js', 'style.js']),
//     ],
// };


module.exports = [public, admin, editor];