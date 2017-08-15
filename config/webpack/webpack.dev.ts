
import * as merge from 'webpack-merge';
import { helpers } from './helpers';
import { ENTRY, METADATA } from './metadata';
import { WebpackCommonConfig } from './webpack.common';

import * as autoprefixer from 'autoprefixer';
import * as ExtractTextPlugin from 'extract-text-webpack-plugin';
import * as StyleExtHtmlWebpackPlugin from 'style-ext-html-webpack-plugin';
import * as webpack from 'webpack';

export const WebpackDevConfig = (env: string, compiler: string, electron: boolean = false) => {
    return merge(
        WebpackCommonConfig({ env: 'development', compiler, electron }),
        config({ env: 'development', compiler, electron }),
    );
};

const config = (options: any) => {
    METADATA.isDevServer = true;
    return {
        entry: ENTRY[options.compiler || METADATA.ENTRY_TYPE],
        devtool: 'cheap-module-source-map',
        output: {
            path: helpers.root('dist'),
            filename: '[name].bundle.js',
            sourceMapFilename: '[file].map',

            chunkFilename: '[id].chunk.js',

            library: 'ac_[name]',
            libraryTarget: 'var',
        },

        module: {

            rules: [

                /**
                 * Extract CSS files from .src/styles directory to external CSS file
                 */
                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: [autoprefixer('last 2 versions')],
                            },
                        },
                    ],
                    include: [helpers.root('src', 'styles')],
                },

                /**
                 * Extract and compile SCSS files from .src/styles directory to external CSS file
                 */
                {
                    test: /\.scss$/,
                    use: [
                        'style-loader',
                        'css-loader',
                        {
                            loader: 'sass-loader',
                            options: {
                                includePaths: [helpers.root('src', 'app', 'shared')],
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: [autoprefixer('last 2 versions')],
                            },
                        },
                    ],
                    include: [helpers.root('src', 'styles')],
                },
            ],
        },
        plugins: [
            new webpack.DefinePlugin({
                'ENV': JSON.stringify(options.env),
                'HMR': METADATA.HMR,
                'process.env': {
                    ENV: JSON.stringify(options.env),
                    NODE_ENV: JSON.stringify(options.env),
                    HMR: METADATA.HMR,
                },
            }),
            new webpack.NamedModulesPlugin(),
            new webpack.LoaderOptionsPlugin({
                debug: true,
                options: {
                    tslint: {
                        emitErrors: false,
                        failOnHint: false,
                        resourcePath: 'src',
                    },
                },
            }),
        ],

        devServer: {
            port: METADATA.port,
            host: '0.0.0.0',
            historyApiFallback: true,
            disableHostCheck: true,
            compress: true,
            watchOptions: {
                aggregateTimeout: 300,
                poll: 1000,
            },
            stats: { colors: true },
            proxy: {
                '/control/websocket' : {
                    target: `ws${METADATA.secure ? 's' : ''}://${METADATA.host}`,
                    ws: true,
                    secure: METADATA.secure,
                    changeOrigin: METADATA.origin,
                },
                '/control' : {
                    target: `http${METADATA.secure ? 's' : ''}://${METADATA.host}`,
                    secure: METADATA.secure,
                    changeOrigin: METADATA.origin,
                },
                '/auth' : {
                    target: `http${METADATA.secure ? 's' : ''}://${METADATA.host}`,
                    secure: METADATA.secure,
                    changeOrigin: METADATA.origin,
                },
                '/app_api' : {
                    target: `http${METADATA.secure ? 's' : ''}://${METADATA.host}`,
                    secure: METADATA.secure,
                    changeOrigin: METADATA.origin,
                },
            },
        },
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
