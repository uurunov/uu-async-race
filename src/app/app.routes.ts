import { Routes } from '@angular/router';

import { GarageComponent } from './components/garage/garage.component';
import { WinnersComponent } from './components/winners/winners.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

export const routes: Routes = [
  { path: 'garage', component: GarageComponent },
  { path: 'winners', component: WinnersComponent },
  { path: '', redirectTo: 'garage', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];
