/**
 * @Author: Alex Sorafumo <alex.sorafumo>
 * @Date:   17/10/2016 4:10 PM
 * @Email:  alex@yuion.net
 * @Filename: app.component.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 01/02/2017 4:23 PM
 */

import { CommsService, SystemsService } from '@acaprojects/a2-composer';
import { ModalService, NotificationService } from '@acaprojects/a2-widgets';

import { Component, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import './shared/mock-system';

import { AppService } from './services';

@Component({
    selector: 'app',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./app.style.scss'],
    template: `
     <div class="app">
     <router-outlet></router-outlet>
     </div>
     `,
})
export class AppComponent {

    constructor(private view: ViewContainerRef,
                private http: CommsService,
                private app: AppService,
                private modal: ModalService,
                private notify: NotificationService,
                private systems: SystemsService,
                private router: Router,
                private route: ActivatedRoute,
    ) {
        // Dynamic components need a view to build then
        modal.view = view;
        notify.view = view;
        this.init();
    }

    public init() {
            // Wait until the settings are loaded before starting
        if (!this.app.Settings.setup) {
            setTimeout(() => {
                this.init();
            }, 500);
            return;
        }
            // Load authentication location details from settings
        const host = this.app.Settings.get('domain');
        const protocol = this.app.Settings.get('protocol');
        const port = ((protocol === 'https:') ? '443' : '80');
        const url = `${protocol}//${host}`;
            // Prepare composer configuration
        const config: any = {
            id: 'AcaEngine',
            scope: 'public',
            host,
            protocol,
            port,
            oauth_server: `${url}/auth/oauth/authorize`,
            oauth_tokens: `${url}/auth/token`,
            redirect_uri: `${location.origin}/oauth-resp.html`,
            api_endpoint: `${url}/control/`,
            proactive: true,
            http: true,
        };
        const env = this.app.Settings.get('env');
        if (env.indexOf('dev') >= 0) {
            config.port = '3000';
            config.mock = true;
            config.http = false;
        }
            // Setup composer
        this.systems.setup(config);
    }
}
