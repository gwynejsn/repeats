import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  withPreloading,
} from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { routes } from './app.routes';
import { authenticationInterceptor } from './authentication/authentication.interceptor';
import { UniqueMeal } from './meals/meal-fetch.service';
import { Meal } from './meals/meal.model';
import { MealsEffects } from './meals/state/meals.effects';
import {
  mealSelectedReducer,
  uniqueMealsReducer,
} from './meals/state/meals.reducers';
import { UserEffects } from './user/state/user.effects';
import { userReducer } from './user/state/user.reducers';
import { User } from './user/user.model';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([authenticationInterceptor])),
    provideStore(),
    provideState('user', userReducer),
    provideState('uniqueMeals', uniqueMealsReducer),
    provideState('mealSelected', mealSelectedReducer),
    provideEffects([UserEffects, MealsEffects]),
  ],
};

export interface StateStructure {
  user: User | null;
  uniqueMeals: UniqueMeal[];
  mealSelected: Meal | null;
}
