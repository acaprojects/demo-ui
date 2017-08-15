import { helpers } from './helpers';

export const ENTRY: any = {
    aot: {
        polyfills: `${helpers.root('src')}/polyfills.browser`,
        main:      `${helpers.root('src')}/main.aot.browser`,
    },
    jit: {
        polyfills: `${helpers.root('src')}/polyfills.browser`,
        main:      `${helpers.root('src')}/main.browser`,
    },
    worker: {
        app: `${helpers.root('src')}/app`,
        worker: `${helpers.root('src')}/main.webworker`,
    },
};

export const METADATA: any = {
    title: 'ACA Angular Starter - Sample App',  // Base title of the application
    short_name: 'ACA_APP',                      // Application Short Name
    desc: 'Application for connecting to ACAEngine', // Application Description
    color: '#ffffff',                                // Application Theme Colour
    baseUrl: '/',               // Base URL that production runs on will be '/' if the application runs on the root.
    ENTRY_TYPE: 'jit',          // Default Compilation type. Value can be 'aot', 'jit', or 'worker'
    port: '3000',               // Port to run the app on
    host: 'localhost:8888',     // Host to proxy to for live network requests
    secure: false,              // Is proxy host on a secure connection. i.e. Uses TLS/SSL
    origin: true,               // Rewrite request origins to match the proxy host
};
