/**
 * @Author: Alex Sorafumo
 * @Date:   28/10/2016 2:30 PM
 * @Email:  alex@yuion.net
 * @Filename: index.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 01/02/2017 10:03 AM
 */

import { AppService } from './app.service';
import { SettingsService } from './settings.service';

export * from './app.service';
export * from './settings.service';

export const SERVICES: any[] = [
    AppService,
    SettingsService,
];
