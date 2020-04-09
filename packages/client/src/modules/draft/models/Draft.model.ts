import { types, getParent, Instance, flow } from "mobx-state-tree";
import { serviceRegistry } from "src/lib/services/registry";

const service = serviceRegistry.draft;

const DraftModel = types
  .model("Draft", {
    _id: types.identifier,
    title: types.string,
    value: "",
    updatedAt: types.string,
  })
  .actions((self) => ({
    setTitle(title: string) {
      self.title = title;
    },
    setValue(value: string) {
      self.value = value;
    },
    remove() {
      (getParent(self, 2) as any).removeDraft(self as IDraft);
    },
    broadcastTitle: flow(function* BT(title: string) {
      yield service.broadcastTitle({ title, editorId: self._id });
      self.title = title;
    }),
    broadcastValue: flow(function* BV(value: string) {
      yield service.broadcastState({ value, editorId: self._id });
      self.value = value;
    }),
  }));

export interface IDraft extends Instance<typeof DraftModel> {}
export default DraftModel;
