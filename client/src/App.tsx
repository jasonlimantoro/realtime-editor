import React from "react";
import Routes from "./routes";
import configureStore from "./store/configureStore";
import { Provider } from "react-redux";

interface Props {}

const store = configureStore();

const App: React.FC<Props> = () => {
  return (
    <Provider store={store}>
      <Routes />
    </Provider>
  );
};

export default App;
