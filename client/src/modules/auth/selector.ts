import { createSelector } from "reselect";
import { AppState } from "../types";

export const selectIsLoggedIn = createSelector(
  (state: AppState) => state.auth.isLoggedIn,
  (state) => state
);

export const selectLoggedInUser = createSelector(
  (state: AppState) => state.auth.credentials.username,
  (state) => state
);

export const selectLogoutReason = createSelector(
  (state: AppState) => state.auth.logoutReason,
  (state) => state
);
