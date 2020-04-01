import React from "react";
import { Provider } from "react-redux";
import Routes from "./routes";
import configureStore from "./store/configureStore";
import { AuthActionType } from "./modules/auth/types";
import CustomStorage from "./lib/storage";

interface Props {}

const store = configureStore();
const storage = new CustomStorage();

store.dispatch({
  type: AuthActionType.HYDRATE,
  payload: {
    token: storage.getToken(),
  },
});

const App: React.FC<Props> = () => {
  return (
    <Provider store={store}>
      <Routes />
    </Provider>
  );
};

export default App;
