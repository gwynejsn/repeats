import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { MealFetchService } from '../meal-fetch.service';
import {
  changeMealSelected,
  changeUniqueMeals,
  deleteMeal,
  deleteMealSuccess,
  initMeals,
  patchMeal,
  patchMealSuccess,
} from './meals.actions';
import { selectUniqueMeals } from './meals.selectors';

export class MealsEffects {
  private actions$ = inject(Actions);
  private store$ = inject(Store);
  private mealFetchService = inject(MealFetchService);

  refetchUniqueMeals = createEffect(() =>
    this.actions$.pipe(
      ofType(initMeals, patchMealSuccess, deleteMealSuccess),
      switchMap(() =>
        this.mealFetchService.getMeals().pipe(
          map((uniqueMeals) => {
            console.log('inside refetch');
            return changeUniqueMeals({ newUniqueMeals: uniqueMeals });
          }),
          catchError((err) =>
            of({ type: '[Meals API] Fetch Failed', error: err })
          )
        )
      )
    )
  );

  patchMeals = createEffect(() =>
    this.actions$.pipe(
      ofType(patchMeal),
      withLatestFrom(this.store$.select(selectUniqueMeals)),
      switchMap(([{ originalName, updatedMeal }, uniqueMeals]) => {
        const mealId = uniqueMeals.find(
          (m) => m.meal.name === originalName
        )?.id;
        const request$ = mealId
          ? this.mealFetchService.patchMeal(mealId, updatedMeal)
          : this.mealFetchService.postMeal(updatedMeal);

        return request$.pipe(
          switchMap(() => [
            patchMealSuccess(),
            changeMealSelected({ newMeal: updatedMeal }),
          ]),
          catchError((err) =>
            of({ type: '[Meal API] Patch Failed', error: err })
          )
        );
      })
    )
  );

  deleteMeals = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteMeal),
      withLatestFrom(this.store$.select(selectUniqueMeals)),
      switchMap(([{ originalName }, uniqueMeals]) => {
        const mealId = uniqueMeals.find(
          (m) => m.meal.name === originalName
        )?.id;

        if (!mealId) {
          console.warn('No meal ID found for deletion');
          return of(deleteMealSuccess());
        }

        return this.mealFetchService.deleteMeal(mealId).pipe(
          map(() => deleteMealSuccess()),
          catchError((err) =>
            of({ type: '[Meal API] Delete Failed', error: err })
          )
        );
      })
    )
  );
}
