import { types, getParent, Instance } from "mobx-state-tree";

const DraftModel = types
  .model("DraftModel", {
    _id: types.identifier,
    title: types.string,
    value: "",
    updatedAt: "",
  })
  .actions((self: { [key: string]: any }) => ({
    remove() {
      (getParent(self, 2) as any).removeDraft(self as IDraft);
    },
  }));

export interface IDraft extends Instance<typeof DraftModel> {}

export default DraftModel;
