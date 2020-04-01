import { createStore, applyMiddleware } from "redux";
// eslint-disable-next-line import/no-extraneous-dependencies
import { composeWithDevTools } from "redux-devtools-extension";
import reduxThunk from "redux-thunk";
import reducer from "src/modules";

const configureStore = (rootReducer = reducer) =>
  createStore(rootReducer, composeWithDevTools(applyMiddleware(reduxThunk)));

export default configureStore;
