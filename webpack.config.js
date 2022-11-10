// const defaultGutenbergConfig = require("@wordpress/scripts/config/webpack.config");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const IgnoreEmitPlugin = require('ignore-emit-webpack-plugin');
const path = require('path');
var glob = require('glob');


var componentsConfig = {
    mode: "production",
    watch: true,

    entry: glob.sync('./assets/scripts/components/*.js'),

    output: {
        filename: 'components.js',
        path: path.resolve(__dirname, 'assets/scripts/dist/'),
    },
};



var mainConfig = {
    mode: "production",
    watch: true,

    entry: glob.sync('./assets/scripts/src/*.js'),

    output: {
        filename: 'popbot.js',
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



module.exports = [mainConfig, componentsConfig];