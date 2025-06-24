import { Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication/authentication.component';
import { SignInComponent } from './authentication/sign-in/sign-in.component';
import { SignUpComponent } from './authentication/sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { authenticationGuard } from './shared/guards/authentication.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'authentication',
    component: AuthenticationComponent,
    children: [
      {
        path: 'sign-in',
        component: SignInComponent,
      },
      {
        path: 'sign-up',
        component: SignUpComponent,
      },
    ],
  },
  {
    path: 'meals',
    loadChildren: () =>
      import('./meals/meals.routes').then((r) => r.mealsRoutes),
    canActivate: [authenticationGuard],
  },
  {
    path: 'shopping-list',
    loadComponent: () =>
      import('./shopping-list/shopping-list.component').then(
        (c) => c.ShoppingListComponent
      ),
    canActivate: [authenticationGuard],
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];
