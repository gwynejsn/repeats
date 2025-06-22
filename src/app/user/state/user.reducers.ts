import { createReducer, on } from '@ngrx/store';
import { User } from '../user.model';
import { changeUser, fetchUser, removeUser } from './user.actions';

export type UserState = User | null;
export const initialUser: UserState = null;
export const userReducer = createReducer<UserState>(
  initialUser,
  on(changeUser, (currUser, { newUser }) => newUser),
  on(removeUser, (currUser) => null),
  on(fetchUser, (state) => state)
);
