/**
 * @author: @AngularClass
 */
let path = require('path');

// Helper functions
let ROOT = path.resolve(__dirname, '../..');

export class helpers {
    public static hasProcessFlag(flag) {
        return process.argv.join('').indexOf(flag) > -1;
    }

    public static isWebpackDevServer() {
        return process.argv[1] && !! (/webpack-dev-server/.exec(process.argv[1]));
    }

    public static root(...args: any[]) {
        args = Array.prototype.slice.call(arguments, 0);
        return path.join.apply(path, [ROOT].concat(args));
    }
}
