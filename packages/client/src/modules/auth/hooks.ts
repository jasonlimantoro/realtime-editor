import { RootStore, useMst } from "src/modules/root";

type Selector<T = any> = (store: RootStore) => T;

export const selectUsername = (store: RootStore) => store.auth.username;
export const selectLogout = (store: RootStore) => store.auth.logout;
export const selectIsLoggedIn = (store: RootStore) => store.auth.isLoggedIn;
export const selectToken = (store: RootStore) => store.auth.token;
export const selectLoginData = (store: RootStore) => ({
  loginError: store.auth.loginError,
  login: store.auth.login,
  logoutReason: store.auth.logoutReason,
});
export const selectRegisterData = (store: RootStore) => ({
  register: store.auth.register,
  registerError: store.auth.registerError,
  registerSuccess: store.auth.registerSuccess,
});

export const useComposeAuth = (...selectors: Selector[]) => {
  const store = useMst();
  return selectors.reduce<any>((data, select) => {
    return [...data, select(store)];
  }, []);
};

export function useAuthStore() {
  const { auth } = useMst();
  return auth;
}
