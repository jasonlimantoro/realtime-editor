import { createContext, useContext } from "react";
import { Instance, types } from "mobx-state-tree";
import makeInspectable from "mobx-devtools-mst";
import DraftListModel from "src/modules/draft/models/DraftList";

const RootModel = types.model("RootModel", {
  drafts: types.optional(DraftListModel, {}),
});

export const store = RootModel.create();
makeInspectable(store);
export interface RootStore extends Instance<typeof store> {}

const RootContext = createContext<null | RootStore>(null);

export const { Provider: MobxProvider } = RootContext;

export const useMst = () => {
  const store = useContext(RootContext);
  if (store === null) {
    throw new Error("No store found");
  }
  return store;
};

export default RootModel;
