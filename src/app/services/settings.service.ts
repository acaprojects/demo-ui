/**
 * @Author: Alex Sorafumo <Yuion>
 * @Date:   09/12/2016 3:33 PM
 * @Email:  alex@yuion.net
 * @Filename: settings.service.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 03/02/2017 9:52 AM
 */

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';

const app_name = 'TOWERS(C)';
const reserved_keys = ['route', 'query', 'store'];

@Injectable()
export class SettingsService {
    public parent: any = null;
    public setup: boolean = false;
    private store: Storage = localStorage;
    private is_loading: boolean = false;
    private loading_observer: Observable<boolean>;
    private loading_text: string = 'Loading...';
    private loading_txt_list: string[] = ['Loading', 'Loading.', 'Loading..', 'Loading...'];
    private loading_txt_obs: Observable<string> = null;
    private loading_cnt: number = 0;
    private closing: boolean = false;
    private settings: any = {};
    private settings_promise: Promise<any>;
    private route_sub: any = null;
    private query_sub: any = null;

    constructor(private http: Http, private route: ActivatedRoute) {
        this.loadStore();
        this.init();
    }

    public init() {
        window.scrollTo(0, 1);
        // Load settings file
        this.loadSettings().then((s: any) => {
            const win = window as any;
            if (s.debug) {
                win.debug = true;
                if (!win.debug_module) {
                    win.debug_module = [];
                }
                if (s.debug_module) {
                    win.debug_module = win.debug_module.concat(s.debug_module);
                }
                if (win.debug_module.indexOf(app_name) < 0) {
                    win.debug_module.push(app_name);
                }
            }
            if (s.version) {
                this.log('SYSTEM', `Version: ${s.version}`);
            }
            if (s.build) {
                this.log('SYSTEM', `Build: ${s.build}`);
            }
            this.setup = true;
        }, (err: any) => {
            setTimeout(() => {
                this.init();
            }, 500);
        });
    }
    /**
     * Prints message to the console
     * @param  {string} type [description]
     * @param  {string} msg    Message to print to the console
     * @param  {string} stream IO Stream to print message to.
     */
    public log(type: string, msg: string, args?: any, stream: string = 'debug') {
        const win = window as any;
        if (win.debug) {
            const colors: string[] = ['color: #E91E63', 'color: #3F51B5', 'color: rgba(0,0,0,0.87'];
            if (args) {
                console[stream](`%c[${app_name}]%c[${type}] %c${msg}`, ...colors, args);
            } else {
                console[stream](`%c[${app_name}]%c[${type}] %c${msg}`, ...colors);
            }
        }
    }

    /**
     * Loads settings from a given JSON file
     * @param  {string = 'assets/settings.json'} file Name of a JSON file to load settings from
     * @return {Promise<Object>}      Returns a promise which returns the settings loaded from the given file
     */
    public loadSettings(file: string = 'assets/settings.json') {
        if (!this.settings_promise) {
            this.settings_promise = new Promise((resolve, reject) => {
                this.http.get(file)
                    .map((res) => res.json())
                    .subscribe(
                    (data) => {
                        for (const i in data) {
                            if (data[i]) {
                                this.settings[i] = data[i];
                            }
                        }
                        const win = window as any;
                        if (win.debug && win.debug_module.indexOf(app_name) >= 0) {
                            this.log('Settings', `Loaded settings for application`);
                        }
                    }, (err) => { reject(err); },
                    () => {
                        resolve(this.settings);
                });
            });
        }
        return this.settings_promise;
    }

    /**
     * Saves the given value in local storage and add it to the settings.
     * @param  {string} key   Reference to store the item as
     * @param  {string} value Value to store in the give key
     * @return none
     */
    public save(key: string, value: string) {
        if (this.store && reserved_keys.indexOf(key) < 0) {
            this.store.setItem(`APP.${key}`, value);
            this.settings[key] = value;
            if (!this.settings.store) {
                this.settings.store = {};
            }
            this.settings.store[key] = value;
        }
    }
    /**
     * Gets the setting value for the give key
     * @param  {string} key Name of the setting to get
     * @return {any}     Returns the value stored in the settings or null
     */
    public get(key: string) {
        const keys = key.split('.');
        if (keys.length === 1) {
            return this.settings[key];
        } else {
            const use_keys = keys.splice(1, keys.length - 1);
            let item = this.getItemFromKeys(use_keys, this.settings[keys[0]]);
            // Check that item exists under the reserved keys
            if (!item && item !== 0) {
                for (const r of reserved_keys) {
                    if (this.settings.hasOwnProperty(r) && this.settings[r]) {
                        item = this.getItemFromKeys(use_keys, this.settings[r]);
                        if (!item && item !== 0) {
                            break;
                        }
                    }
                }
            }
            return item;
        }
    }
    /**
     * Gets nested setting value
     * @param  {string[]} keys List of keys to iterate down the object
     * @param  {any}      root Root element of the search
     * @return {any}        Returns the value a the end of the iteration or null
     */
    public getItemFromKeys(keys: string[], root: any) {
        if (keys.length <= 0) {
            return root;
        }
        if (typeof root !== 'object') {
            return null;
        }
        let item = root;
        // Iterate through keys to traverse object tree
        for (const k of keys) {
            // Make sure key has a value
            if (k !== '') {
                if (item !== undefined && item !==  null && item.hasOwnProperty(k)) {
                    item = item[k];
                } else {
                    return null;
                }
            }
        }
        return item;
    }
    /**
     * Wrapper function for get()
     * @param  {string} key Name of the setting to get
     * @return {any}     Returns the value stored in the settings or null
     */
    public setting(key: string) {
        return this.get(key);
    }
    /**
     * Sets the loading state of the application
     * @param  {boolean} state Loading state of the application
     * @return none
     */
    public loading(state: boolean) {
        this.is_loading = state;
        if (this.is_loading) {
            this.loading_text = this.loading_txt_list[0];
        }
    }
    /**
     * Returns an object to observe the loading state of the application
     * @return {Observable<boolean>} Observer which updates on the changes to the application's loading state
     */
    public loadingState() {
        if (!this.loading_observer) {
            this.loading_observer = new Observable((observer) => {
                observer.next(this.is_loading);
                const fn = () => {
                    if (this.closing) {
                        observer.complete();
                    } else {
                        observer.next(this.is_loading);
                        setTimeout(fn, 250);
                    }
                };
                setTimeout(fn, 250);
            });
        }
        return this.loading_observer;
    }


    public loadingText() {
        if (!this.loading_txt_obs) {
            this.loading_txt_obs = new Observable((observer: any) => {
                observer.next(this.loading_text);
                if (this.loading_cnt % 4 === 0) {
                    if (this.loading_txt_list.length > 1) {
                        const index = (this.loading_txt_list.indexOf(this.loading_text) + 1)
                        this.loading_text = this.loading_txt_list[index % this.loading_txt_list.length];
                    } else { this.loading_text = 'Loading...'; }
                }
                const fn = () => {
                    if (this.closing) {
                        observer.complete();
                    } else {
                        observer.next(this.loading_text);
                        if (this.loading_cnt % 4 === 0) {
                            if (this.loading_txt_list.length > 1) {
                                const index = (this.loading_txt_list.indexOf(this.loading_text) + 1);
                                this.loading_text = this.loading_txt_list[index % this.loading_txt_list.length];
                            } else { this.loading_text = 'Loading...'; }
                        }
                        this.loading_cnt++;
                        setTimeout(fn, 250);
                    }
                };
                setTimeout(fn, 250);
            });
        }
        return this.loading_txt_obs;
    }
    /**
     * Check if browser is a mobile browser
     * @return {boolean} Returns whether or not the browser is mobile or not.
     */
    public mobilecheck() {
        let check = false;
        (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true })(navigator.userAgent || navigator.vendor);
        return check;
    }
    /**
     * Toggles fullscreen on and off
     * @return none
     */
    public toggleFullScreen() {
        const doc: any = window.document;
        const docEl: any = doc.documentElement;

        const requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen ||
            docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        const cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen ||
            doc.webkitExitFullscreen || doc.msExitFullscreen;

        if (!doc.fullscreenElement && !doc.mozFullScreenElement &&
            !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
            requestFullScreen.call(docEl);
        } else {
            cancelFullScreen.call(doc);
        }
    }

    public ngOnDestroy() {
        this.closing = true;
        if (this.route_sub) {
            this.route_sub.unsubscribe();
        }
        if (this.query_sub) {
            this.query_sub.unsubscribe();
        }
    }
    /**
     * Loads all the keys from local storage into the settings.
     * @return none
     */
    private loadStore() {
        // Load local store settings
        if (this.store) {
            for (let i = 0; i < this.store.length; i++) {
                let key = this.store.key(i);
                const item = this.store.getItem(key);
                if (item !== undefined && item !== null && item !== '') {
                    if (key.indexOf(`APP.`) === 0) {
                        key = key.replace(`APP.`, '');
                    }
                    if (!this.settings.store) {
                        this.settings.store = {};
                    }
                    this.settings.store[key] = item;
                }
            }
        }
    }
}
