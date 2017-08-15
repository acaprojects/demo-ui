
import { helpers } from './helpers';
import { HeaderConfig } from './head-config';
import { HtmlElementsPlugin } from './html-elements-plugin';
import { ENTRY, METADATA } from './metadata';


import * as autoprefixer from 'autoprefixer';
import * as AwesomeTypescriptLoader from 'awesome-typescript-loader';
import * as CopyWebpackPlugin from 'copy-webpack-plugin';
import * as ExtractTextPlugin from 'extract-text-webpack-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as ngcWebpack from 'ngc-webpack';
import * as path from 'path';
import * as ScriptExtHtmlWebpackPlugin from 'script-ext-html-webpack-plugin';
import * as webpack from 'webpack';
import * as ManifestPlugin from 'webpack-pwa-manifest';

export const WebpackCommonConfig = (options: any) => {
    const isProd = options.env === 'production';
    METADATA.isDevServer = options.serve === true;
    const assets = [
        { from: 'src/assets', to: 'assets' },
        { from: 'src/oauth-resp.html', to: 'oauth-resp.html' },
    ];
    if (options.electron) {
        assets.push({ from: './main.js', to: './' });
        METADATA.baseUrl = './';
    }
    return {
        target: (options.electron ? 'electron-renderer' : 'web'),
        resolve: {
            extensions: ['.js', '.ts', '.json'],
            modules: ['src', '_predist', 'node_modules'],
        },

        stats: {
            // Configure the console output
            errorDetails: true, //this does show errors
            colors: true,
            modules: true,
            reasons: true,
        },

        module: {
            exprContextCritical: false,
            rules: [
                {
                    test: /\.ts$/,
                    use: [{
                        /**
                         *  MAKE SURE TO CHAIN VANILLA JS CODE, I.E. TS COMPILATION OUTPUT.
                         */
                        loader: 'ng-router-loader',
                        options: {
                            loader: 'async-import',
                            genDir: 'compiled',
                            aot: options.compiler !== 'jit',
                        },
                    }, {
                        loader: 'awesome-typescript-loader',
                        options: {
                            configFileName: 'tsconfig.webpack.json',
                            useCache: !isProd,
                        },
                    },
                        'angular2-template-loader',
                    ],
                }, {
                    test: /\.html$/,
                    use: 'raw-loader',
                    exclude: [helpers.root('src/index.html')]
                }, {
                    test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                    use: 'file-loader?name=assets/[name].[hash].[ext]',
                }, {
                    test: /\.css$/,
                    use: ['to-string-loader', 'css-loader'],
                    exclude: [helpers.root('src', 'styles')],
                }, {
                    test: /\.scss$/,
                    use: [
                        'to-string-loader',
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: [autoprefixer('last 2 versions')],
                            },
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                includePaths: [helpers.root('src', 'app', 'shared')],
                            },
                        },
                    ],
                    exclude: [helpers.root('src', 'styles')],
                },
            ],
        },
        plugins: [
            new ManifestPlugin({
                name: METADATA.title,
                short_name: METADATA.short_name,
                description: METADATA.desc,
                background_color: METADATA.color,
                theme_color: METADATA.color,
                // start_url: METADATA.isDevServer ? 'localhost:3000' : METADATA.host,
                icons: [
                    {
                        src: path.resolve('src/assets/icon/icon.png'),
                        sizes: [96, 128, 192, 256, 384, 512], // multiple sizes
                        destination: path.join('assets', 'icons'),
                    },
                ],
                fingerprints: false,
            }),
            new AwesomeTypescriptLoader.CheckerPlugin(),
            new webpack.ContextReplacementPlugin(
                /angular(\\|\/)core(\\|\/)@angular/,
                helpers.root('src'),
                {}
            ),
            // Copy static assets
            new CopyWebpackPlugin(assets),
            new ScriptExtHtmlWebpackPlugin({
                sync: /polyfill|vendor/,
                defaultAttribute: 'async',
                preload: [/polyfill|vendor|main/],
                prefetch: [/chunk/],
            }),
            new HtmlWebpackPlugin({
                template: 'src/index.html',
                title: METADATA.title,
                chunksSortMode: (a, b) => {
                    const order = ['polyfills', 'libs', 'js', 'vendor', 'main'];
                    return order.indexOf(a.names[0]) - order.indexOf(b.names[0]);
                },
                metadata: METADATA,
                inject: 'body',
            }),
            //
            new HtmlElementsPlugin({
                headTags: HeaderConfig,
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'polyfills',
                chunks: ['polyfills'],
            }),
            /*
            new CommonsChunkPlugin({
                name: 'vendor',
                chunks: ['main']
            }),
            // */
            new ngcWebpack.NgcWebpackPlugin({
                disabled: options.compiler === 'jit',
                tsConfig: helpers.root('tsconfig.webpack.json'),
            }),
        ],
        node: {
            global: true,
            crypto: 'empty',
            process: true,
            module: false,
            clearImmediate: false,
            setImmediate: false,
        },
    };
};
