import { User } from "./entities/User";

export default class CustomStorage {
  _storage: Storage;

  STORAGE_KEYS = {
    CRED: "CRED",
  };

  constructor({ storage = localStorage } = {}) {
    this._storage = storage;
  }

  saveCredentials(credentials: User) {
    try {
      this._storage.setItem(
        this.STORAGE_KEYS.CRED,
        JSON.stringify(credentials)
      );
    } catch {}
  }

  getCredentials(): User {
    let result = null;
    try {
      result = JSON.parse(
        this._storage.getItem(this.STORAGE_KEYS.CRED) as string
      );
    } catch {}
    return result;
  }

  flushCredentials() {
    this._storage.removeItem(this.STORAGE_KEYS.CRED);
  }

  hasCredentials() {
    return this.getCredentials() !== null;
  }
}
