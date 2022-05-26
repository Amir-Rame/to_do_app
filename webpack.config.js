const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'production',
    entry: {
        main: path.resolve(__dirname, 'src/index.js'),
    },
    output: {
        path: path.resolve(__dirname,'dist'),
        filename: '[name].js',
        clean:true, //create only one file
        assetModuleFilename: '[name][ext]' // preserve asset name
    },
    devtool: 'source-map', //to detect exact line of error in debugging(creates js.map)
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist')
        },
        port: 3000, //port= localhost:3000
        open: true, //open browser as well
        hot: true,
        compress: true,
        historyApiFallback: true,
    },
    module: { 
        rules: [
            { //to compile sass
                test: /\.css$/i,
                use:['style-loader', 'css-loader'],
            },
            { //to compile js -> backwards compatibility
                test: /\.js$/,
                exclude: /node_modules/,
                use:{
                    loader: 'babel-loader',
                    options:{
                        presets: ['@babel/preset-env']
                    },
                },
            },
            { //to include assets
                test: /\.(png|svg|jpeg|jpg|gif)$/i,
                type: 'asset/resource'
            },
        ],
    },
    plugins: [ //active plugin
        new HtmlWebpackPlugin({
            title: 'To Do',
            filename: 'index.html',
            template: './src/template.html', //using template for plugin
        }),
    ],
}







