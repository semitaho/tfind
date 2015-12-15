var webpack = require('webpack');
var path = require('path');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
module.exports = {
    entry: "./client/main.js",
    output: {
        path: __dirname,
        filename: "./public/js/bundle.js"
    },
    module: {
        loaders: [
            { 
                test: /\.jsx$/, 
                exclude: nodeModulesPath,
                loader: "babel",
                query: {
                    presets: ['es2015','react']
                }
             },
             { 
                test: /\.js$/, 
                exclude: nodeModulesPath,
                loader: "babel",
                query: {
                    presets: ['es2015', 'react']
                }
             }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin(
            {
                minimize: true,
                compress: {
                   warnings: false
                }
            })
    ]
};
