import { types, flow } from "mobx-state-tree";
import { serviceRegistry } from "src/lib/services/registry";
import { defaultStorage } from "src/lib/storage";
import { User } from "src/lib/entities/User";

const service = serviceRegistry.auth;
const storage = defaultStorage;

const AuthModel = types
  .model("AuthModel", {
    username: "",
    token: "",
    isLoggedIn: false,
    logoutReason: "",
    loginError: "",
    registerError: "",
    registerLoaded: false,
  })
  .actions((self) => ({
    hydrate({ username, token }: { username: string; token: string }) {
      self.username = username;
      self.token = token;
      self.isLoggedIn = true;
    },
    login: flow(function* login(username: string, password: string) {
      try {
        self.loginError = "";
        const { data }: { data: { user: User } } = yield service.login(
          username,
          password
        );
        storage.save(data.user);
        self.username = data.user.username;
        self.token = data.user.token;
        self.isLoggedIn = true;
      } catch (e) {
        self.loginError = e.response.data.message;
      }
    }),
    logout(reason = "user initiated") {
      self.username = "";
      self.token = "";
      self.isLoggedIn = false;
      self.logoutReason = reason;
      storage.flush();
    },
    register: flow(function* register(username: string, password: string) {
      self.registerError = "";
      try {
        yield service.register(username, password);
        self.registerLoaded = true;
      } catch (e) {
        self.registerError = e.response.data.message;
      }
    }),
  }))
  .views((self) => ({
    get registerSuccess() {
      return self.registerLoaded && !self.registerError;
    },
  }));

export default AuthModel;
