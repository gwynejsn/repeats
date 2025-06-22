import { createAction, props } from '@ngrx/store';
import { User } from '../user.model';

export const changeUser = createAction(
  '[user] change',
  props<{ newUser: User }>()
);

export const removeUser = createAction('[user] remove');
export const fetchUser = createAction('[user] fetch');
