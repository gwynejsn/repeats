import { createReducer, on } from '@ngrx/store';
import { UniqueMeal } from '../meal-fetch.service';
import { Meal } from '../meal.model';
import {
  changeMealSelected,
  changeUniqueMeals,
  initMeals,
  setMealsLoader,
} from './meals.actions';

export const initialMealLoader = false;
export const mealLoaderReducer = createReducer(
  initialMealLoader,
  on(setMealsLoader, (state, { isLoading }) => isLoading)
);

export const initialUniqueMeals: UniqueMeal[] = [];
export const uniqueMealsReducer = createReducer(
  initialUniqueMeals,
  on(initMeals, (state) => {
    console.log('init meals');
    return state;
  }),
  on(changeUniqueMeals, (currMeals, { newUniqueMeals }) => {
    return newUniqueMeals;
  })
);

export const initialMealSelected: Meal | null = null;
export const mealSelectedReducer = createReducer<Meal | null>(
  initialMealSelected,
  on(changeMealSelected, (currMealSelected, { newMeal }) => newMeal)
);
