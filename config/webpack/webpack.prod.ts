
import * as merge from 'webpack-merge';
import { helpers } from './helpers';
import { ENTRY, METADATA } from './metadata';
import { WebpackCommonConfig } from './webpack.common';

import * as autoprefixer from 'autoprefixer';
import * as ExtractTextPlugin from 'extract-text-webpack-plugin';
import * as OfflinePlugin from 'offline-plugin';
import * as OptimizeJsPlugin from 'optimize-js-plugin';
import * as StyleExtHtmlWebpackPlugin from 'style-ext-html-webpack-plugin';
import * as webpack from 'webpack';

export const WebpackProdConfig = (env: string, compiler: string, electron: boolean = false) => {
    return merge(
        WebpackCommonConfig({ env: 'production', compiler, electron }),
        config({ env: 'production', compiler, electron }),
    );
};

const config = (options: any) => {
    const conf: any = {
        entry: ENTRY[options.compiler || METADATA.ENTRY_TYPE],
        devtool: 'source-map',
        output: {
            path: helpers.root('dist'),
            filename: '[name].[chunkhash].bundle.js',
            sourceMapFilename: '[file].map',

            chunkFilename: '[id].[chunkhash].chunk.js',
        },
        module: {
            rules: [

                /**
                 * Extract CSS files from .src/styles directory to external CSS file
                 */
                {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: [
                            'css-loader',
                            {
                                loader: 'postcss-loader',
                                options: {
                                    plugins: [autoprefixer('last 2 versions')],
                                },
                            },
                        ],
                    }),
                    include: [helpers.root('src', 'styles')],
                },

                /**
                 * Extract and compile SCSS files from .src/styles directory to external CSS file
                 */
                {
                    test: /\.scss$/,
                    loader: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: [
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
                    }),
                    include: [helpers.root('src', 'styles')],
                },
            ],
        },
        plugins: [
            new OptimizeJsPlugin({
                sourceMap: false,
            }),
            new ExtractTextPlugin('[name].css'),
            new StyleExtHtmlWebpackPlugin(),
            new webpack.DefinePlugin({
                'ENV': JSON.stringify(options.env),
                'HMR': METADATA.HMR,
                'process.env': {
                    ENV: JSON.stringify(options.env),
                    NODE_ENV: JSON.stringify(options.env),
                    HMR: METADATA.HMR,
                },
            }),
            new webpack.optimize.UglifyJsPlugin({
                // beautify: true, //debug
                // mangle: false, //debug
                // dead_code: false, //debug
                // unused: false, //debug
                // deadCode: false, //debug
                // compress: {
                //   screw_ie8: true,
                //   keep_fnames: true,
                //   drop_debugger: false,
                //   dead_code: false,
                //   unused: false
                // }, // debug
                // comments: true, //debug


                beautify: false, //prod
                //output: {
                //comments: false,
                //}, //prod
                mangle: {
                    screw_ie8: true,
                }, //prod
                compress: {
                    screw_ie8: true,
                    warnings: false,
                    conditionals: true,
                    unused: true,
                    comparisons: true,
                    sequences: true,
                    dead_code: true,
                    evaluate: true,
                    if_return: true,
                    join_vars: true,
                    negate_iife: false, // we need this for lazy v8
                },
            }),
            new webpack.LoaderOptionsPlugin({
                debug: false,
                options: {
                    tslint: {
                        emitErrors: true,
                        failOnHint: true,
                        resourcePath: 'src',
                    },
                    htmlLoader: {
                        minimize: true,
                        removeAttributeQuotes: false,
                        caseSensitive: true,
                        customAttrSurround: [
                            [/#/, /(?:)/],
                            [/\*/, /(?:)/],
                            [/\[?\(?/, /(?:)/],
                        ],
                        customAttrAssign: [/\)?\]?=/],
                    },
                },
            }),
            new OfflinePlugin({
                autoUpdate: 10 * 60 * 1000,
                ServiceWorker: {
                    events: true,
                },
                AppCache: {
                    events: true,
                },
            }),
        ],
        node: {
            global: true,
            crypto: 'empty',
            process: false,
            module: false,
            clearImmediate: false,
            setImmediate: false,
        },
    };
    return conf;
};
