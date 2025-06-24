import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Gender, User } from './user.model';

interface UserStored {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  email: string;
}
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private dbEndpoint = environment.apiUrl + '/users.json';

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  storeUserInfo(
    name: string,
    age: number,
    gender: Gender,
    email: string,
    idToken: string
  ) {
    return this.http.post(
      this.dbEndpoint,
      {
        id: this.generateId() + name,
        name: name,
        age: age,
        gender: gender,
        email: email,
      },
      {
        params: new HttpParams().set('auth', idToken),
      }
    );
  }

  fetchUserInfo(
    email: string,
    idToken: string,
    expiresIn: string
  ): Observable<User | undefined> {
    return this.http
      .get<{ [key: string]: UserStored }>(this.dbEndpoint, {
        params: new HttpParams().set('auth', idToken),
      })
      .pipe(
        map((res) => {
          const users: User[] = [];
          for (const id in res) {
            const userObject = res[id];
            const expirationDate = new Date(
              Date.now() + Number(expiresIn) * 1000
            );
            console.log('Expires at:', expirationDate);

            users.push(
              new User(
                userObject.id,
                userObject.name,
                +userObject.age,
                userObject.gender,
                userObject.email,
                idToken,
                expirationDate
              )
            );
          }

          return users.find((user) => user.email === email);
        })
      );
  }

  jsonToUser(jsonUser: string) {
    const objUser = JSON.parse(jsonUser);
    return new User(
      objUser.id,
      objUser.name,
      objUser.age,
      objUser.gender,
      objUser.email,
      objUser._idToken,
      new Date(objUser._tokenExpiration)
    );
  }
}
