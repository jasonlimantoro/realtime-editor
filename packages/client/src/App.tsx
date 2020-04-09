import React from "react";
import { Provider } from "react-redux";
import Routes from "./routes";
import configureStore from "./store/configureStore";
import { hydrate } from "./modules/auth/action";
import { MobxProvider, store as mobxStore } from "./modules/root";

interface Props {}

const store = configureStore();

store.dispatch(hydrate());

const App: React.FC<Props> = () => {
  return (
    <Provider store={store}>
      <MobxProvider value={mobxStore}>
        <Routes />
      </MobxProvider>
    </Provider>
  );
};

export default App;
