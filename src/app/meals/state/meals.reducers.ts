import { createReducer, on } from '@ngrx/store';
import { UniqueMeal } from '../meal-fetch.service';
import { Meal } from '../meal.model';
import {
  changeMealSelected,
  changeUniqueMeals,
  initMeals,
} from './meals.actions';

export const initialUniqueMeals: UniqueMeal[] = [];
export const uniqueMealsReducer = createReducer(
  initialUniqueMeals,
  on(initMeals, (state) => {
    console.log('init meals');
    return state;
  }),
  on(changeUniqueMeals, (currMeals, { newUniqueMeals }) => {
    console.log('here');
    console.log(newUniqueMeals);
    return newUniqueMeals;
  })
);

export const initialMealSelected: Meal | null = null;
export const mealSelectedReducer = createReducer<Meal | null>(
  initialMealSelected,
  on(changeMealSelected, (currMealSelected, { newMeal }) => newMeal)
);
