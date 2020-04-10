import { types, flow } from "mobx-state-tree";
import { serviceRegistry } from "src/lib/services/registry";
import { defaultStorage } from "src/lib/storage";

const service = serviceRegistry.auth;
const storage = defaultStorage;

const AuthModel = types
  .model({
    username: "",
    token: "",
    isLoggedIn: false,
    logoutReason: "",
  })
  .actions((self) => ({
    hydrate({ username, token }: { username: string; token: string }) {
      self.username = username;
      self.token = token;
      self.isLoggedIn = true;
    },
    login: flow(function* login(username: string, password: string) {
      const { data } = yield service.login(username, password);
      storage.saveCredentials(data.user);
      self.username = data.user.usename;
      self.token = data.user.token;
      self.isLoggedIn = true;
    }),
    logout(reason = "user initiated") {
      self.username = "";
      self.token = "";
      self.isLoggedIn = false;
      self.logoutReason = reason;
      storage.flushCredentials();
    },
    register: flow(function* register(username: string, password: string) {
      yield service.register(username, password);
    }),
  }));

export default AuthModel;
