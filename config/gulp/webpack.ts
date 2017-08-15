
import * as packager from 'electron-packager';
import * as gulp from 'gulp';
import * as util from 'gulp-util';
import * as runSequence from 'run-sequence';
import * as webpack from 'webpack';
import * as WebpackDevServer from 'webpack-dev-server';
import * as yargs from 'yargs';
import { WebpackDevConfig } from '../webpack/webpack.dev';
import { WebpackProdConfig } from '../webpack/webpack.prod';
import { WebpackTestConfig } from '../webpack/webpack.test';
import { Dashboard } from './dashboard';

const argv = yargs.argv;

Dashboard.show(argv.env || 'dev');

const config: any = {
    dev: WebpackDevConfig,
    prod: WebpackProdConfig,
    test: WebpackTestConfig,
};

const DEFAULTS: any = {
    env: 'dev',
    compile: 'jit',
};

const serve = (compiler: any, server: any) => {
    new WebpackDevServer(compiler, server)
        .listen(3000, '0.0.0.0', (err) => {
            if (err) {
                throw new util.PluginError('webpack-dev-server', err);
            }
            // Server listening
            util.log('[webpack-dev-server]', 'http://localhost:8080/webpack-dev-server/index.html');

            // keep the server alive or continue?
            // callback();
        });
};

const loadWebpack = (env: string, c: string, electron: boolean = false) => {
    util.log('Loading webpack config', env);
    return config[env](env, c, electron);
};

gulp.task('deploy', () => {
        // Process CLI options
    const prod = argv.prod !== undefined || argv.production !== undefined;
    const aot = argv.aot !== undefined;
    const worker = argv.worker !== undefined || argv.webworker !== undefined;
        // Process CLI variables
    let env = argv.env || DEFAULTS.env;
    if (prod) {
        env = 'prod';
    }
    let c = argv.compile || argv.compiler || argv.c || DEFAULTS.compile;
    if (worker) {
        c = 'worker';
    } else if (aot) {
        c = 'aot';
    }
    const wp_conf = loadWebpack(env, c);
    util.log('[webpack:build]', `${env}:${c}`);
    webpack(wp_conf).run((err, stats) => {
        if (err) {
            throw new util.PluginError('webpack:build', err);
        }
        util.log('[webpack:build]', stats.toString({
            colors: true,
        }));
    });
});

gulp.task('package', () => runSequence('clean', 'electron'));

gulp.task('electron', () => {
        // Process CLI options
    const prod = argv.prod !== undefined || argv.production !== undefined;
    const aot = argv.aot !== undefined;
    const worker = argv.worker !== undefined || argv.webworker !== undefined;
        // Process CLI variables
    let env = argv.env || DEFAULTS.env;
    if (prod) {
        env = 'prod';
    }
    let c = argv.compile || argv.compiler || argv.c || DEFAULTS.compile;
    if (worker) {
        c = 'worker';
    } else if (aot) {
        c = 'aot';
    }
    const wp_conf = loadWebpack(env, c, true);
    util.log('[webpack:build]', `${env}:${c}`);
    return webpack(wp_conf).run((err, stats) => {
        if (err) {
            throw new util.PluginError('webpack:build', err);
        }
        util.log('[webpack:build]', stats.toString({
            colors: true,
        }));

        packager({
                dir: './dist',
                out: '_package',
                overwrite: true,
            }, (error, appPaths) => {
                console.log('===========================================================');
                console.log('================ Electron Packager Results ================');
                console.log('===========================================================');
                if (error) {
                    console.log(error);
                } else if (appPaths) {
                    console.log(appPaths.join('\n'));
                }
            });
    });
});

gulp.task('build', () => runSequence('clean', 'version', 'deploy'));
gulp.task('serve', () => runSequence('clean', 'version', 'serve-app'));

gulp.task('serve-app', () => {
        // Process CLI options
    const prod = argv.prod !== undefined || argv.production !== undefined;
    const aot = argv.aot !== undefined;
    const worker = argv.worker !== undefined || argv.webworker !== undefined;
        // Process CLI variables
    let env = argv.env || DEFAULTS.env;
    if (prod) {
        env = 'prod';
    }
    let c = argv.compile || argv.compiler || argv.c || DEFAULTS.compile;
    if (worker) {
        c = 'worker';
    } else if (aot) {
        c = 'aot';
    }
        // Startup Webpack Dev server
    const config = loadWebpack(env, c);
    const wp = webpack(config);
    util.log('[webpack:serve]', `${env}:${c}`);
    return serve(wp, config.devServer || { stats: { colors: true } });
});
