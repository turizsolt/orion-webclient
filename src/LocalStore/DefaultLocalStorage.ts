export class DefaultLocalStorage {
  getItem(key: string): any {
    return window.localStorage.getItem(key);
  }
  setItem(key: string, value: any): void {
    window.localStorage.setItem(key, value);
  }
  clear(): void {
    window.localStorage.clear();
  }
}
