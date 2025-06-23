import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of, switchMap, tap } from 'rxjs';
import { MealFetchService } from '../../meals/meal-fetch.service';
import { initMeals } from '../../meals/state/meals.actions';
import { ShoppingListFetchService } from '../../shopping-list/shopping-list-fetch.service';
import { User } from '../user.model';
import { UserService } from '../user.service';
import { changeUser, fetchUser, removeUser } from './user.actions';

export class UserEffects {
  private actions$ = inject(Actions);
  // private store$ = inject(st)
  private userService = inject(UserService);
  private mealFetchService = inject(MealFetchService);
  private shoppingListFetchService = inject(ShoppingListFetchService);

  saveUserToLocalStorage = createEffect(
    () =>
      this.actions$.pipe(
        ofType(changeUser),
        tap(({ newUser }) => {
          localStorage.setItem('user', JSON.stringify(newUser));
          this.mealFetchService.setUserId = '/userData/' + newUser.id;
          this.shoppingListFetchService.setUserId = '/userData/' + newUser.id;
        })
      ),
    {
      dispatch: false,
    }
  );

  removeUserFromLocalStorage = createEffect(
    () =>
      this.actions$.pipe(
        ofType(removeUser),
        tap(() => {
          localStorage.removeItem('user');
          this.mealFetchService.setUserId = '';
          this.shoppingListFetchService.setUserId = '';
        })
      ),
    {
      dispatch: false,
    }
  );

  fetchUserFromLocalStorage = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchUser),
      switchMap(() => {
        const rawUser = localStorage.getItem('user');
        if (rawUser) {
          const user: User = this.userService.jsonToUser(rawUser);
          if (new Date() >= user.tokenExpiration) return of(removeUser()); // if expired
          return of(changeUser({ newUser: user }));
        } else return EMPTY;
      })
    )
  );

  loadMeals = createEffect(() =>
    this.actions$.pipe(
      ofType(changeUser),
      switchMap(() => of(initMeals()))
    )
  );
}
