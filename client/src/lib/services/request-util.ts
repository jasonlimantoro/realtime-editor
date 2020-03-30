import axios, { AxiosRequestConfig } from "axios";

interface RequestParams {
  method?: "get" | "post" | "patch" | "put" | "delete";
  path?: string;
  data?: any;
}

export default class RequestUtilService {
  public baseUrl: String;

  public namespace: String;

  constructor({ baseUrl = "", namespace = "" } = {}) {
    this.baseUrl = baseUrl;
    this.namespace = namespace;
  }

  getConfig = (): AxiosRequestConfig => ({});

  // eslint-disable-next-line consistent-return
  request = async ({ method = "get", path = "", data }: RequestParams) => {
    const finalPath = `${this.baseUrl}/${path}`;
    switch (method) {
      case "get":
        return axios.get(finalPath, this.getConfig());
      case "post":
        return axios.post(finalPath, data, this.getConfig());
      case "patch":
        return axios.patch(finalPath, data, this.getConfig());
      case "put":
        return axios.put(finalPath, data, this.getConfig());
      case "delete":
        return axios.delete(finalPath, this.getConfig());
    }
  };
}
