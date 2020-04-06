import { createStore, applyMiddleware } from "redux";
// eslint-disable-next-line import/no-extraneous-dependencies
import { composeWithDevTools } from "redux-devtools-extension";
import reduxThunk from "redux-thunk";
import reducer from "src/modules";
import { logout } from "src/modules/auth/action";
import { api } from "./middlewares";

const jwtExpiryGuard = (store: any) => (next: any) => (action: any) => {
  if (action.payload && action.payload.data && action.payload.data.code) {
    if (action.payload.data.code === "token_expired") {
      store.dispatch(logout({ reason: "token has expired" }));
      return;
    }
  }
  next(action);
};
const configureStore = (rootReducer = reducer) =>
  createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(reduxThunk, jwtExpiryGuard, api))
  );

export default configureStore;
