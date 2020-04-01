import { createSelector } from "reselect";
import { AppState } from "../types";

export const selectIsLoggedIn = createSelector(
  (state: AppState) => state.auth.isLoggedIn,
  (state) => state
);
