import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import reduxThunk from "redux-thunk";
import reducer from "../modules";

const configureStore = (rootReducer = reducer) =>
  createStore(rootReducer, composeWithDevTools(applyMiddleware(reduxThunk)));

export default configureStore;
