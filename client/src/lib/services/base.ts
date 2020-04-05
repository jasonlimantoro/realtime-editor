import RequestUtilService from "./request-util";

export default class BaseService {
  public baseUrl: string;

  public namespace: string;

  public requestUtil: any;

  constructor({
    baseUrl = "",
    namespace = "",
    RequestUtil = RequestUtilService,
  } = {}) {
    this.baseUrl = baseUrl;
    this.namespace = namespace;
    this.requestUtil = new RequestUtil({ baseUrl, namespace });
  }
}
