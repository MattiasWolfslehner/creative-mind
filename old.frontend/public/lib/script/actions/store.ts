export class localStorageAction {
  static async save<T>(name: string, data: T): Promise<void> {
    localStorage.setItem(name, JSON.stringify(data));
  }

  static async load<T>(name: string): Promise<T | null> {
    const storedData = localStorage.getItem(name);
    return storedData ? JSON.parse(storedData) : null;
  }
}
