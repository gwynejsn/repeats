export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
}
export class User {
  constructor(
    public id: string,
    public name: string,
    public age: number,
    public gender: Gender,
    public email: string,
    private _idToken: string,
    private _tokenExpiration: Date
  ) {}

  get idToken() {
    return this._idToken;
  }

  get tokenExpiration() {
    return this._tokenExpiration;
  }
}
