import { combineReducers } from "redux";
import todo from "./todo";
import auth from "./auth";
import draft from "./draft";

const rootReducer = combineReducers({
  todo,
  auth,
  draft,
});

export default rootReducer;
