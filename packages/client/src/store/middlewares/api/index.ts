import { AnyAction, Middleware } from "redux";
import { ApiActionType } from "./types";

interface ApiAble extends AnyAction {
  payload: {
    network: () => Promise<any>;
    onStart: () => any;
    onSuccess: (data: any) => any;
    onFailure: (error: Error) => any;
  };
}

const api: Middleware = ({ dispatch }) => (next) => (action: ApiAble) => {
  if (action.type.indexOf(ApiActionType) === -1) {
    next(action);
    return;
  }
  dispatch(action.payload.onStart());
  action.payload
    .network()
    .then(({ data }) => {
      dispatch(action.payload.onSuccess(data));
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error);
      dispatch(action.payload.onFailure(error));
    });
};

export default api;
