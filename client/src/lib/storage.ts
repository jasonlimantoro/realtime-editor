export default class CustomStorage {
  _storage: Storage;

  STORAGE_KEYS = {
    JWT: "jwt-token",
  };

  constructor({ storage = localStorage } = {}) {
    this._storage = storage;
  }

  getToken() {
    return this._storage.getItem(this.STORAGE_KEYS.JWT);
  }

  saveToken(token: string) {
    this._storage.setItem(this.STORAGE_KEYS.JWT, token);
  }
}
