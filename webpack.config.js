const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

let options =
{
    entry:
    [
        // 'babel-polyfill',
        './js/main.js',
    ],
    output:
    {
        path: path.resolve(__dirname, 'docs'),
        filename: 'main.js',
        publicPath: process.env.NODE_ENV == 'production' ? './' : '/',
    },
    module:
    {
        rules:
        [
            {
                test: /\.(js|jsx)(\?\S*)?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query:
                {
                    presets: ['es2015', 'react', 'stage-0'],
                    plugins: ['transform-decorators-legacy'],
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [{ loader: 'ifdef-loader', 
                options:
                {
                    DEBUG: process.env.ADS_TYPE == 'DEBUG',
                }
                }]
            },
            {
                test: /\.glsl$/,
                loader: 'webpack-glsl-loader'
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.(png|gif|eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader'
            }
        ]
    },
    devServer: {
        compress: true,
        disableHostCheck: true,
    },
    plugins:
    [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin(
        {
            template: 'index.html',
            inject: 'body',
        }),
    ],
    resolveLoader:
    {
        modules: [path.resolve('./node_modules'), process.env.NODE_PATH],
    },
    resolve:
    {
        modules: [path.resolve('./node_modules'), process.env.NODE_PATH],
    }
}
if (process.env.NODE_ENV == 'production')
{
    options.module.loaders.push(
    {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{ loader: "constant-loader" }]
    })
    options.plugins.push(new UglifyJSPlugin())
}
module.exports = options
