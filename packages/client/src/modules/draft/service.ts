import BaseService from "src/lib/services/base";

export default class DraftService extends BaseService {
  CHANGE_STATE = "CHANGE_STATE";

  CHANGE_STATE_LISTENER = "CHANGE_STATE_LISTENER";

  CHANGE_TITLE = "CHANGE_TITLE";

  CHANGE_TITLE_LISTENER = "CHANGE_TITLE_LISTENER";

  CREATE_ROOM = "CREATE_ROOM";

  LEAVE_ROOM = "LEAVE_ROOM";

  NEW_COLLABORATOR = "NEW_COLLABORATOR";

  REMOVE_COLLABORATOR = "REMOVE_COLLABORATOR";

  TIMESTAMP_LISTENER = "TIMESTAMP_LISTENER";

  update: any;

  list = () => this.requestUtil.request({ path: "drafts" });

  detail = (id: string) => this.requestUtil.request({ path: `drafts/${id}` });

  destroy = (id: string) =>
    this.requestUtil.request({ path: `drafts/${id}`, method: "delete" });

  create = (body: any) =>
    this.requestUtil.request({ method: "post", path: "drafts", data: body });

  broadcastTitle = (data: any) =>
    this.requestUtil.emit(this.CHANGE_TITLE, data);

  broadcastValue = (data: any) =>
    this.requestUtil.emit(this.CHANGE_STATE, data);

  listenValue = (cb: any) =>
    this.requestUtil.listen(this.CHANGE_STATE_LISTENER, cb);

  unlistenState = () => this.requestUtil.unlisten(this.CHANGE_STATE_LISTENER);

  listenTitle = (cb: any) =>
    this.requestUtil.listen(this.CHANGE_TITLE_LISTENER, cb);

  unlistenTitle = () => this.requestUtil.unlisten(this.CHANGE_TITLE_LISTENER);

  createRoom = (data: any) => this.requestUtil.emit(this.CREATE_ROOM, data);

  listenNewCollaborator = (cb: any) =>
    this.requestUtil.listen(this.NEW_COLLABORATOR, cb);

  leaveRoom = (data: any) => this.requestUtil.emit(this.LEAVE_ROOM, data);

  listenRemoveCollaborator = (cb: any) =>
    this.requestUtil.listen(this.REMOVE_COLLABORATOR, cb);

  listenTimestamp = (cb: any) =>
    this.requestUtil.listen(this.TIMESTAMP_LISTENER, cb);
}
