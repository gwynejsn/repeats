import { createSelector } from '@ngrx/store';
import { StateStructure } from '../../app.config';

export const selectUser = (state: StateStructure) => {
  return state.user;
};

export const selectIsLoggedIn = createSelector(selectUser, (user) => !!user);

export const selectUserEmail = createSelector(
  selectUser,
  (user) => user?.email
);
