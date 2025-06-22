import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { map } from 'rxjs';
import { selectIsLoggedIn } from '../../user/state/user.selectors';

export const authenticationGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const store$ = inject(Store);

  return store$.pipe(
    select(selectIsLoggedIn),
    map((isLoggedIn) => {
      if (isLoggedIn) return true;
      else return router.createUrlTree(['/authentication', 'sign-in']);
    })
  );
};
