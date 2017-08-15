
import { RouterModule, Routes } from '@angular/router';
import { SampleComponent } from './sample';

export const ROUTES: Routes = [
    { path: '', component: SampleComponent },
    { path: ':sys_id', component: SampleComponent },
    { path: '**',      redirectTo: '' },
];
