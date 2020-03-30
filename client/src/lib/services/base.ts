import RequestUtilService from "./request-util";

export default class BaseService {
  public baseUrl: String;

  public namespace: String;

  public requestUtil: RequestUtilService;

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
