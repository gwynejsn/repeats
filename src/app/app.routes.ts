import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MealDetailsComponent } from './meals/meal-details/meal-details.component';
import { MealEditComponent } from './meals/meal-edit/meal-edit.component';
import { MealNoSelectedComponent } from './meals/meal-no-selected/meal-no-selected.component';
import { MealsComponent } from './meals/meals.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'meals',
    component: MealsComponent,
    children: [
      {
        path: '',
        component: MealNoSelectedComponent,
      },
      {
        path: ':meal-name',
        component: MealDetailsComponent,
      },
      {
        path: 'new-recipe/edit',
        component: MealEditComponent,
      },
      {
        path: ':meal-name/edit',
        component: MealEditComponent,
      },
    ],
  },
  {
    path: 'shopping-list',
    component: ShoppingListComponent,
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];
