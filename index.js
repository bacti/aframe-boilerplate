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
        loaders:
        [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query:
                {
                    presets: ['es2015', 'react', 'stage-0'],
                    plugins: []
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
        modules: [path.join(process.env.NODEJS, 'node_modules'),process.env.NODE_PATH,path.resolve('./node_modules')],
    },
    resolve:
    {
        modules: [path.join(process.env.NODEJS, 'node_modules'),process.env.NODE_PATH,path.resolve('./node_modules')],
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
