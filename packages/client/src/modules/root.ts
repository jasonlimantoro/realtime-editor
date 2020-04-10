import { createContext, useContext } from "react";
import { Instance, types, addMiddleware } from "mobx-state-tree";
import { connectReduxDevtools } from "mst-middlewares";
import DraftListModel from "src/modules/draft/models/draftList.model";
import AuthModel from "src/modules/auth/auth.model";
import { defaultStorage } from "src/lib/storage";
import EditorModel from "src/modules/editor/editor.model";

const RootModel = types
  .model("RootModel", {
    drafts: types.optional(DraftListModel, {}),
    auth: types.optional(AuthModel, {}),
    editor: types.optional(EditorModel, {}),
    search: "",
  })
  .actions((self) => ({
    setSearch(text: string) {
      self.search = text;
    },
  }));

export const store = RootModel.create();

if (process.env.NODE_ENV === "development") {
  // eslint-disable-next-line global-require,import/no-extraneous-dependencies
  connectReduxDevtools(require("remotedev"), store, { logArgsNearName: false });
}

addMiddleware(store, (call, next, _abort) => {
  if (call.type === "flow_throw") {
    const code = call.args?.[0]?.response?.data?.code;
    if (/(expire|revoke)/.test(code)) {
      store.auth.logout(code);
    }
  }
  next(call);
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
