import { getRoot, Instance, types } from "mobx-state-tree";
import { serviceRegistry } from "src/lib/services/registry";
import { keys } from "mobx";

const service = serviceRegistry.draft;

const Collaborator = types.model("collaborator", {
  username: types.identifier,
  clientId: types.string,
});

const EditorModel = types
  .model({
    title: "",
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
    setUpdatedAt(updatedAt: string) {
      self.updatedAt = updatedAt;
    },
    setCollaborators(id: string, value: string) {
      self.collaborators.set(id, value);
    },
    removeCollaborator(id: string) {
      self.collaborators.delete(id);
    },

    broadcast(field: "Title" | "Value", data: any) {
      Object(service)[`broadcast${field}`](data);
      self[`set${field}`](data[field.toLowerCase()]);
    },
    listen() {
      service.listenValue((data: any) => {
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
      const root = getRoot(self) as any;
      return keys(self.collaborators).reduce<any[]>((accum, current) => {
        if (current === root.auth.username) {
          return accum;
        }
        return [...accum, current];
      }, []);
    },
  }));
export interface IEditor extends Instance<typeof EditorModel> {}
export default EditorModel;
