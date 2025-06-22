import { Routes } from '@angular/router';
import { MealDetailsComponent } from './meal-details/meal-details.component';
import { MealEditComponent } from './meal-edit/meal-edit.component';
import { MealNoSelectedComponent } from './meal-no-selected/meal-no-selected.component';
import { MealsComponent } from './meals.component';

export const mealsRoutes: Routes = [
  {
    path: '',
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
];
