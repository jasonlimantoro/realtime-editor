/* eslint-disable no-console */
import { RequestUtilService } from "react-common-util";
import io from "socket.io-client";
import { defaultStorage } from "src/lib/storage";

const MAX_RECONNECTION_ATTEMPTS = 5;
export default class DraftServiceUtil extends RequestUtilService {
  public socket: SocketIOClient.Socket;

  constructor({ baseUrl = "" }) {
    super({ baseUrl });
    this.socket = io.connect(baseUrl, {
      reconnectionAttempts: MAX_RECONNECTION_ATTEMPTS,
    });
    this.socket.on("error", (err: any) => {
      console.error(err);
    });
    this.socket.on("disconnect", (reason: string) => {
      console.log("DISCONNECTED", reason);
    });
    this.socket.on("reconnect_attempt", (attemptNumber: string) => {
      console.group("reconnect_attempt");
      console.log(
        `Reattempting connection ${attemptNumber}/${MAX_RECONNECTION_ATTEMPTS}`
      );
      console.groupEnd();
    });
  }

  getConfig = () => {
    const credentials = defaultStorage.get();
    if (credentials && credentials.token) {
      return {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      };
    }
    return {};
  };

  emit = async (event: string, data: any) => {
    this.socket.emit(event, data);
  };

  listen = async (event: string, cb: Function) => {
    this.socket.on(event, cb);
  };

  unlisten = async (event: string) => {
    this.socket.off(event);
  };

  unlistenAll = async () => {
    this.socket.removeAllListeners();
  };
}
