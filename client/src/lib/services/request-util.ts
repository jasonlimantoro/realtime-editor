import axios, { AxiosRequestConfig } from "axios";
import io from "socket.io-client";
import CustomStorage from "../storage";

interface RequestParams {
  method?: "get" | "post" | "patch" | "put" | "delete";
  path?: string;
  data?: any;
}

const storage = new CustomStorage();

export default class RequestUtilService {
  public baseUrl: String;

  public namespace: String;

  public _io: SocketIOClient.Socket;

  constructor({ baseUrl = "", namespace = "" } = {}) {
    this.baseUrl = baseUrl;
    this.namespace = namespace;
    this._io = io.connect(baseUrl, {
      query: storage.hasCredentials()
        ? `token=${storage.getCredentials().token}`
        : "",
    });
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

  emit = async (event: string, data: any) => {
    this._io.emit(event, data);
  };

  listen = async (event: string, cb: Function) => {
    this._io.on(event, cb);
  };

  unlisten = async (event: string) => {
    this._io.off(event);
  };

  unlistenAll = async () => {
    this._io.removeAllListeners();
  };
}
