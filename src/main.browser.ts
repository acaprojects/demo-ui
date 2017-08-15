/* BOOTSTRAP APPLICATION */
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app';
import { decorateModuleRef } from './app/environment';

import * as OfflinePluginRuntime from 'offline-plugin/runtime';

declare let ENV: any;

if (ENV === 'production') {
    OfflinePluginRuntime.install({
        onUpdating: () => {
            console.log('[ACA][CACHE]', 'Updating');
        },
        onUpdateReady: () => {
            console.log('[ACA][CACHE]', 'Update ready!');
            // Tells to new SW to take control immediately
            OfflinePluginRuntime.applyUpdate();
        },
        onUpdated: () => {
            console.log('[ACA][CACHE]', 'Updated');
            // Reload the webpage to load into the new version
            window.location.reload();
        },

        onUpdateFailed: () => {
            console.log('[ACA][CACHE]', 'Update failed.');
        },
    });
}

export function main(): Promise<any> {
    return platformBrowserDynamic()
        .bootstrapModule(AppModule)
        .then(decorateModuleRef)
        .catch((err) => console.error(err));
}

/**
 * Needed for hmr
 * in prod this is replace for document ready
 */
switch (document.readyState) {
    case 'loading':
        document.addEventListener('DOMContentLoaded', _domReadyHandler, false);
        break;
    case 'interactive':
    case 'complete':
    default:
        main();
}

function _domReadyHandler() {
    document.removeEventListener('DOMContentLoaded', _domReadyHandler, false);
    main();
}
