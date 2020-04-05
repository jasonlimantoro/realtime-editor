import axios, { AxiosRequestConfig } from "axios";
import { defaultStorage } from "src/lib/storage";

interface RequestParams {
  method?: "get" | "post" | "patch" | "put" | "delete";
  path?: string;
  data?: any;
}

const storage = defaultStorage;

export default class RequestUtilService {
  public baseUrl: String;

  public namespace: String;

  constructor({ baseUrl = "", namespace = "" } = {}) {
    this.baseUrl = baseUrl;
    this.namespace = namespace;
  }

  getConfig = (): AxiosRequestConfig => {
    const credential = storage.getCredentials();
    if (credential) {
      return {
        headers: {
          Authorization: `Bearer ${credential.token}`,
        },
      };
    }
    return {};
  };

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
