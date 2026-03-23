import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { UserDetail } from './pages/user-detail/user-detail';
import { UserForm } from './pages/user-form/user-form';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: Home },
];
