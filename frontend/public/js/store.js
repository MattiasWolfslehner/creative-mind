export default class localStorageAction {
  static async save(name, data) {
    localStorage.setItem(name, JSON.stringify(data));
  }

  static async load(name) {
    return JSON.parse(localStorage.getItem(name));
  }
}
