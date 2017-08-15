/**
 * @Author: Alex Sorafumo <alex.sorafumo>
 * @Date:   12/01/2017 2:25 PM
 * @Email:  alex@yuion.net
 * @Filename: app.service.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 03/02/2017 10:25 AM
 */

import { SystemsService } from '@acaprojects/a2-composer';
import { ModalService, NotificationService } from '@acaprojects/a2-widgets';
import { Location } from '@angular/common';
import { Inject, Injectable, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { SettingsService } from './settings.service';

@Injectable()
export class AppService {

    private _system: string = '';
    private sys_change: any = null;
    private _sys_obs: any = null;
    private prev_route: string[] = [];

    constructor(private _title: Title,
                private router: Router,
                private location: Location,
                private route: ActivatedRoute,
                private modal: ModalService,
                private notify: NotificationService,
                private settings: SettingsService,
                private systems: SystemsService) {

        settings.parent = this;

        this._sys_obs = new Observable((observer: any) => {
            this.sys_change = observer;
            this.sys_change.next(this._system);
        });
        this.init();
    }

    get endpoint() {
        const host = this.Settings.get('domain');
        const protocol = this.Settings.get('protocol');
        const port = ((protocol === 'https:') ? '443' : '80');
        const url = `${protocol}//${host}`;
        const api_endpoint = `${url}`;
        return api_endpoint;
    }

    public initSystem(sys: string) {
        this._system = sys;
        if (!this._system || this._system === '') {
            if (localStorage) {
                this._system = localStorage.getItem('ACA.CONTROL.system');
                if (this.sys_change) {
                    this.sys_change.next(this._system);
                }
            }
            if (!this._system || this._system === '') {
                this.navigate('bootstrap');
            } else {
                this.navigate(this._system);
            }
        } else {
            if (this.sys_change) {
                this.sys_change.next(this._system);
            }
        }
    }

    public init() {
        if (!this.settings.setup) {
            setTimeout(() => {
                this.init();
            }, 500);
            return;
        }
    }

    public ngOnDestroy() {
        this.sys_change.complete();
    }

    get Settings() {
        return this.settings;
    }

    get Systems() {
        return this.systems;
    }

    get Modal() {
        return this.modal;
    }

    get system() {
        return this._sys_obs;
    }

    set title(str: string) {
        this._title.setTitle(`${str} | Int. Towers - Client App`);
    }

    public navigate(path: string, query?: any) {
        this.prev_route.push(this.router.url);
        // if (!this.systems.resources.authLoaded) {
        this.router.navigate([path], { queryParams: query });
        // } else {
        // this.router.navigate([path]);
        // }
    }

    public back(query?: any) {
        if (this.prev_route.length > 0) {
            this.navigate(this.prev_route.pop(), query);
            this.prev_route.pop();
        } else {
            this.navigate('', query);
        }
    }

    public log(type: string, msg: string, args?: any, stream: string = 'debug') {
        this.settings.log(type, msg, args, stream);
    }

    public error(msg: string) {
        const message = msg ? msg : `Error`;
        this.notify.add(`
            <div class="display-icon error" style="font-size:2.0em"></div><
            div>${message}</div>`,
            'error-notify');
    }

    public success(msg: string) {
        const message = msg ? msg : `Success`;
        this.notify.add(`
            <div class="display-icon success" style="font-size:2.0em"></div>
            <div>${message}</div>`,
            'success-notify');
    }

    public info(msg: string) {
        const message = msg ? msg : `Information`;
        this.notify.add(`
            <div class="display-icon info" style="font-size:2.0em"></div>
            </div><div>${message}</div>`,
            'info-notify');
    }

}
