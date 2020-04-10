import { createContext, useContext } from "react";
import { Instance, types, addMiddleware, onSnapshot } from "mobx-state-tree";
import { actionLogger } from "mst-middlewares";
import makeInspectable from "mobx-devtools-mst";
import DraftListModel from "src/modules/draft/models/DraftList";
import AuthModel from "src/modules/auth/Auth.model";
import { defaultStorage } from "src/lib/storage";
import EditorModel from "src/modules/editor/editor.model";

const RootModel = types.model("RootModel", {
  drafts: types.optional(DraftListModel, {}),
  auth: types.optional(AuthModel, {}),
  editor: types.optional(EditorModel, {}),
});

export const store = RootModel.create();
makeInspectable(store);
addMiddleware(store, actionLogger);
onSnapshot(store, (snapshot) => {
  // eslint-disable-next-line no-console
  console.log(snapshot);
});

const currentCredential = defaultStorage.getCredentials();
if (currentCredential) {
  store.auth.hydrate(currentCredential);
}
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
