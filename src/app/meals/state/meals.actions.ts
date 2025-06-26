import { createAction, props } from '@ngrx/store';
import { UniqueMeal } from '../meal-fetch.service';
import { Meal } from '../meal.model';

export const setMealsLoader = createAction(
  '[Meals] set meal loader',
  props<{ isLoading: boolean }>()
);

export const initMeals = createAction('[Meals] Init');

export const changeUniqueMeals = createAction(
  '[Meals] Change',
  props<{ newUniqueMeals: UniqueMeal[] }>()
);

export const patchMeal = createAction(
  '[Meals] Patch',
  props<{ updatedMeal: Meal; originalName: string }>()
);

export const deleteMeal = createAction(
  '[Meals] Delete',
  props<{ originalName: string }>()
);

export const changeMealSelected = createAction(
  '[Meal Selected] Change',
  props<{ newMeal: Meal | null }>()
);

export const patchMealSuccess = createAction('[Meals API] Patch Success');
export const deleteMealSuccess = createAction('[Meals API] Delete Success');
