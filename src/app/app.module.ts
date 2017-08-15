/**
 * @Author: Alex Sorafumo <alex.sorafumo>
 * @Date:   17/10/2016 4:10 PM
 * @Email:  alex@yuion.net
 * @Filename: app.module.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 01/02/2017 10:03 AM
 */

import { ACA_COMPOSER_MODULE } from '@acaprojects/a2-composer';
import { ACA_WIDGETS_MODULE } from '@acaprojects/a2-widgets';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { ENV_PROVIDERS } from './environment';

import { AppComponent } from './app.component';
import { ROUTES } from './app.routes';
import { APP_COMPONENTS } from './sample';
import { SERVICES } from './services';

// Application wide providers
const APP_PROVIDERS: any[] = [
    ...SERVICES,
];

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
    bootstrap: [AppComponent],
    declarations: [
        AppComponent,
        APP_COMPONENTS,
    ],
    imports: [ // import Angular's modules
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpModule,
        RouterModule.forRoot(ROUTES, { useHash: true }),
        ACA_WIDGETS_MODULE,
        ACA_COMPOSER_MODULE,
    ],
    entryComponents: [
    ],
    providers: [ // expose our Services and Providers into Angular's dependency injection
        ENV_PROVIDERS,
        APP_PROVIDERS,
    ],
})
export class AppModule {
}
