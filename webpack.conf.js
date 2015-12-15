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
                exclude: /(react-bootstrap-datetimepicker)/,
                loader: "babel",
                query: {
                    presets: ['es2015','react']
                }
             },
             { 
                test: /\.js$/, 
                exclude: /(react-bootstrap-datetimepicker)/,
                loader: "babel",
                query: {
                    presets: ['es2015', 'react']
                }
             }
        ]
    }
};
