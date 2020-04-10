import { types, getParent, Instance } from "mobx-state-tree";
import { keys } from "mobx";
import { serviceRegistry } from "src/lib/services/registry";

const service = serviceRegistry.draft;

const Collaborator = types.model("collaborator", {
  username: types.identifier,
  clientId: types.string,
});
const DraftModel = types
  .model("Draft", {
    _id: types.identifier,
    title: types.string,
    value: "",
    updatedAt: "",
    collaborators: types.optional(types.map(Collaborator), {}),
  })
  .actions((self: { [key: string]: any }) => ({
    setTitle(title: string) {
      self.title = title;
    },
    setValue(value: string) {
      self.value = value;
    },
    remove() {
      (getParent(self, 2) as any).removeDraft(self as IDraft);
    },
    setUpdatedAt(updatedAt: string) {
      self.updatedAt = updatedAt;
    },
    setCollaborators(id: string, value: string) {
      self.collaborators.set(id, value);
    },
    removeCollaborator(id: string) {
      self.collaborators.delete(id);
    },

    broadcastTitle(title: string) {
      service.broadcastTitle({ title, editorId: self._id });
      self.setTitle(title);
    },
    broadcastValue(value: string) {
      service.broadcastState({ value, editorId: self._id });
      self.setValue(value);
    },
    listen() {
      service.listenState((data: any) => {
        self.setValue(data.value);
      });
      service.listenTitle((data: any) => {
        self.setTitle(data.title);
      });
      service.listenTimestamp((data: any) => {
        self.setUpdatedAt(data.updatedAt);
      });
      service.listenNewCollaborator(
        (data: { collaborators: { [key: string]: string } }) => {
          Object.keys(data.collaborators).forEach((k) => {
            self.setCollaborators(
              k,
              Collaborator.create({
                username: k,
                clientId: data.collaborators[k],
              })
            );
          });
        }
      );
      service.listenRemoveCollaborator((data: { user: string }) => {
        self.removeCollaborator(data.user);
      });
    },
    unlisten() {
      service.requestUtil.unlistenAll();
    },
    join(data: any) {
      service.createRoom(data);
    },
    leave(data: any) {
      service.leaveRoom(data);
    },
  }))
  .views((self) => ({
    get allCollaborators(): string[] {
      return keys(self.collaborators) as any;
    },
  }));

export interface IDraft extends Instance<typeof DraftModel> {}
export default DraftModel;
