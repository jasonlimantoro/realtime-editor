import React from "react";
import { Provider } from "react-redux";
import Routes from "./routes";
import configureStore from "./store/configureStore";
import { hydrate } from "./modules/auth/action";

interface Props {}

const store = configureStore();

store.dispatch(hydrate());

const App: React.FC<Props> = () => {
  return (
    <Provider store={store}>
      <Routes />
    </Provider>
  );
};

export default App;
