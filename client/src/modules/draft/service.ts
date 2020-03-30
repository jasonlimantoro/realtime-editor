import BaseService from "src/lib/services/base";

export default class DraftService extends BaseService {
  list = () => this.requestUtil.request({ path: "editors" });

  detail = (id: string) => this.requestUtil.request({ path: `editor/${id}` });
}
