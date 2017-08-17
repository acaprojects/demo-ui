# ACA Angular Starter Kit

## Setup

Install [NodeJS](https://nodejs.org/en/download/current/)
Install [Gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md) with `npm install --global gulp-cli`
Install npm dependancies using `npm install`

## Development

To run the dev server use the command `gulp serve`

By default the dev web server proxies all requests to the set live system, if you wish to use a mock system use `--mock` when calling `gulp serve`

## Compilation

Compile the application into static files using `gulp build`

The command takes the arguments `--prod` to minify the resulting build and `--aot` to compile the angular code using the angular Ahead of Time compiler.

Compilation settings can be found in `config/webpack/metadata.ts`.

Application/Runtime settings can be found in `assets/settings.json`.
