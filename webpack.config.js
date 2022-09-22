const path = require('path');
var glob = require('glob');


var defaultConfig = {
    watch: true,

    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['css-loader'],
            },
        ],
    },

    mode: "production"
};



var componentsConfig = Object.assign({}, defaultConfig, {
    entry: glob.sync('./assets/scripts/components/*.js'),

    output: {
        filename: 'components.js',
        path: path.resolve(__dirname, 'assets/scripts/dist/'),
    },
});



var mainConfig = Object.assign({}, defaultConfig, {
    entry: glob.sync('./assets/scripts/src/*.js'),

    output: {
        filename: 'popbot.js',
        path: path.resolve(__dirname, 'assets/scripts/dist/'),
    },
});



module.exports = [mainConfig, componentsConfig];