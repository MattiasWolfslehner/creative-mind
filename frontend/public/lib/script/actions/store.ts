export class localStorageAction {
  static async save(name: string, data: any): Promise<void> {
    console.log('data', data);
    localStorage.setItem(name, JSON.stringify(data));
  }

  static async load(name: string): Promise<any> {
    return JSON.parse(localStorage.getItem(name));
  }
}
