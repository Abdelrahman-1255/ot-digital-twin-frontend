import { Routes } from '@angular/router';
import { AssetListComponent } from './components/asset-list/asset-list.component';
import { AssetDetailsComponent } from './components/asset-details/asset-details.component';

export const routes: Routes = [
  { path: '', redirectTo: '/assets', pathMatch: 'full' },
  { path: 'assets', component: AssetListComponent },
  { path: 'assets/:id', component: AssetDetailsComponent }
];
