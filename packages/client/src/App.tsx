import React from "react";
import Routes from "./routes";
import { MobxProvider, store as mobxStore } from "./modules/root";

interface Props {}

const App: React.FC<Props> = () => {
  return (
    <MobxProvider value={mobxStore}>
      <Routes />
    </MobxProvider>
  );
};

export default App;
