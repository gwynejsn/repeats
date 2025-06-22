import {
  HttpEvent,
  HttpHandlerFn,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, switchMap, take } from 'rxjs';
import { selectUser } from '../user/state/user.selectors';
import { User } from '../user/user.model';

export function authenticationInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  // add headers
  const store$ = inject(Store);
  return store$.pipe(
    select(selectUser),
    take(1),
    switchMap((user: User | null) => {
      if (user) {
        const newReq = req.clone({
          params: new HttpParams().set('auth', user.idToken),
        });
        return next(newReq);
      } else return next(req);
    })
  );
}
