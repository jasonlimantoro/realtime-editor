import { destroy, flow, getRoot, Instance, types } from "mobx-state-tree";
import { values } from "mobx";
import DraftModel, { IDraft } from "src/modules/draft/models/draft.model";
import moment from "moment";
import { serviceRegistry } from "src/lib/services/registry";
import isEmpty from "lodash/isEmpty";

const draftService = serviceRegistry.draft;

const DraftListModel = types
  .model("DraftListModel", {
    items: types.map(DraftModel),
  })
  .actions((self) => ({
    fetchDrafts: flow(function* F() {
      const { data } = yield draftService.list();
      data.forEach((d: any) => {
        self.items.set(d._id, d);
      });
    }),
    createDrafts: flow(function* C(body: any) {
      const { data } = yield draftService.create(body);
      if (isEmpty(data)) return;
      self.items.set(data._id, data);
    }),
    removeDraft: flow(function* R(item: IDraft) {
      yield draftService.destroy(item._id);
      destroy(item);
    }),
    detailDraft: flow(function* D(id: string) {
      const { data } = yield draftService.detail(id);
      const root = getRoot(self) as any;
      root.editor.setTitle(data.title);
      root.editor.setValue(data.value);
      root.editor.setUpdatedAt(data.updatedAt);
    }),
  }))
  .views((self) => ({
    get draftsByDate() {
      return values(self.items).reduce((accum: any, current: any) => {
        const day = moment(Number(current._id)).format("YYYY-MM-DD");
        return {
          ...accum,
          [day]:
            accum[day]?.length > 0 ? accum[day].concat(current) : [current],
        };
      }, {});
    },
    get draftscount() {
      return values(self.items).length;
    },
  }));
export interface IDraftList extends Instance<typeof DraftListModel> {}

export default DraftListModel;
