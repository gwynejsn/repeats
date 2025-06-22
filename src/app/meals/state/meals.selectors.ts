import { createSelector } from '@ngrx/store';
import { StateStructure } from '../../app.config';

export const selectUniqueMeals = (state: StateStructure) => state.uniqueMeals;
export const selectMeals = createSelector(selectUniqueMeals, (uniqueMeals) =>
  uniqueMeals.map((u) => u.meal)
);

export const selectMealSelected = (state: StateStructure) => state.mealSelected;
