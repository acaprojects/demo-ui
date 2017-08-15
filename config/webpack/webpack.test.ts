
import * as merge from 'webpack-merge';
import { WebpackCommonConfig } from './webpack.common';

export const WebpackTestConfig = (env, compiler) => {
    return merge(
        WebpackCommonConfig({env: 'testing', compiler}),
        config({env: 'testing', compiler}),
    );
};

const config = (options: any) => {
    return {};
};
