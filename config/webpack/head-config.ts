/**
 * Configuration for head elements added during the creation of index.html.
 *
 * All href attributes are added the publicPath (if exists) by default.
 * You can explicitly hint to prefix a publicPath by setting a boolean value to a key that has
 * the same name as the attribute you want to operate on, but prefix with =
 *
 * Example:
 * { name: "msapplication-TileImage", content: "/assets/icon/ms-icon-144x144.png", "=content": true },
 * Will prefix the publicPath to content.
 *
 * { rel: "apple-touch-icon", sizes: "57x57", href: "/assets/icon/apple-icon-57x57.png", "=href": false },
 * Will not prefix the publicPath on href (href attributes are added by default
 *
 */
export const HeaderConfig = {
    link: [
        /** <link> tags for "apple-touch-icon" (AKA Web Clips). **/
        { rel: "apple-touch-icon", sizes: "57x57", href: "assets/icon/apple-touch-icon-57x57.png" },
        { rel: "apple-touch-icon", sizes: "60x60", href: "assets/icon/apple-touch-icon-60x60.png" },
        { rel: "apple-touch-icon", sizes: "72x72", href: "assets/icon/apple-touch-icon-72x72.png" },
        { rel: "apple-touch-icon", sizes: "76x76", href: "assets/icon/apple-touch-icon-76x76.png" },
        { rel: "apple-touch-icon", sizes: "114x114", href: "assets/icon/apple-touch-icon-114x114.png" },
        { rel: "apple-touch-icon", sizes: "120x120", href: "assets/icon/apple-touch-icon-120x120.png" },
        { rel: "apple-touch-icon", sizes: "144x144", href: "assets/icon/apple-touch-icon-144x144.png" },
        { rel: "apple-touch-icon", sizes: "152x152", href: "assets/icon/apple-touch-icon-152x152.png" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "assets/icon/apple-touch-icon-180x180.png" },

        /** <link> tags for android web app icons **/
        //{ rel: "icon", type: "image/png", sizes: "192x192", href: "assets/icon/android-icon-192x192.png" },

        /** <link> tags for favicons **/
        { rel: "icon", type: "image/png", sizes: "32x32", href: "assets/icon/favicon-32x32.png" },
        { rel: "icon", type: "image/png", sizes: "96x96", href: "assets/icon/favicon-96x96.png" },
        { rel: "icon", type: "image/png", sizes: "16x16", href: "assets/icon/favicon-16x16.png" },

        /** <link> tags for a Web App Manifest **/
        { rel: "manifest", href: "assets/manifest.json" }
    ],
    meta: [    	//Apple home screen app fullscreen
        { name: "mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-capable", content: "yes" },
        { name: "format-detection", content: "telephone=no" },
        { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
        { name: "application-name", content: "International Towers - Client App" },
        { name: "msapplication-tooltip", content: "International Towers - Client App" },
        { name: "msapplication-starturl", content: "./" },
        { name: "msapplication-navbutton-color", content: "#000000" },
        { name: "msapplication-TileColor", content: "#000000" },
        { name: "msapplication-TileImage", content: "assets/icon/mstile-144x144.png", "=content": true },
        { name: "msapplication-square70x70logo", content: "assets/icon/mstile-70x70.png" },
        { name: "msapplication-square150x150logo", content: "assets/icon/mstile-150x150.png" },
        { name: "msapplication-square310x150logo", content: "assets/icon/mstile-310x150.png" },
        { name: "msapplication-square310x310logo", content: "assets/icon/mstile-310x310.png" },
        { name: "theme-color", content: "#B71C1C" }

    ]
};
