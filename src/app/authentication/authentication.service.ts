import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { catchError, map, Observable, switchMap, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { changeUser, fetchUser, removeUser } from '../user/state/user.actions';
import { Gender, User } from '../user/user.model';
import { UserService } from '../user/user.service';

export interface ResponsePayload {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: number;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private http = inject(HttpClient);
  private userService = inject(UserService);
  private router = inject(Router);
  private store$ = inject(Store);

  private signUpEndpoint =
    'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
    environment.apiKey;

  private signInEndpoint =
    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
    environment.apiKey;

  private autoLogoutInterval: any;

  signUp(
    name: string,
    age: number,
    gender: Gender,
    email: string,
    password: string
  ): Observable<User> {
    return this.http
      .post<ResponsePayload>(this.signUpEndpoint, {
        email: email,
        password: password,
        returnSecureToken: true,
      })
      .pipe(
        switchMap((res) => {
          return this.userService
            .storeUserInfo(name, age, gender, email, res.idToken)
            .pipe(
              switchMap(() => {
                // sign in after creating an acc
                return this.signIn(email, password);
              })
            );
        }),
        catchError((err) => {
          console.error('Sign up failed:', err.message);
          return this.handleError(err);
        })
      );
  }

  signIn(email: string, password: string): Observable<User> {
    return this.http
      .post<ResponsePayload>(this.signInEndpoint, {
        email,
        password,
        returnSecureToken: true,
      })
      .pipe(
        switchMap((res) => {
          // if no errors, retrieve the user info
          return this.userService
            .fetchUserInfo(email, res.idToken, res.expiresIn)
            .pipe(
              map((user) => {
                if (!user) {
                  throw new Error('User not found');
                }
                this.store$.dispatch(changeUser({ newUser: user }));

                return user;
              })
            );
        }),
        catchError((err) => {
          console.error('Sign-in or user fetch failed:', err.message);
          this.handleError(err);
          return this.handleError(err);
        })
      );
  }

  private handleError(resErr: HttpErrorResponse) {
    let errorMessage = 'Unknown error occured';
    if (resErr.error && resErr.error.error) {
      switch (resErr.error.error.message) {
        case 'EMAIL_EXISTS':
          errorMessage = 'This email exists already';
          break;
        case 'INVALID_LOGIN_CREDENTIALS':
          errorMessage = 'The email or password is not correct.';
          break;
      }
    }
    console.log(errorMessage);
    return throwError(() => errorMessage);
  }

  logout() {
    this.store$.dispatch(removeUser());
    if (this.autoLogoutInterval) clearInterval(this.autoLogoutInterval);
    this.autoLogoutInterval = null;
    this.router.navigate(['/authentication', 'sign-in']);
  }

  autoLogin() {
    this.store$.dispatch(fetchUser());
  }

  autoLogout(expiration: number) {
    this.autoLogoutInterval = setTimeout(() => {
      this.logout();
    }, expiration);
  }
}
