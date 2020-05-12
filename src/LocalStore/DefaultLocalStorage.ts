import { LocalStorage } from './LocalStorage';

export class DefaultLocalStorage implements LocalStorage {
  getItem(key: string): any {
    return window.localStorage.getItem(key);
  }
  setItem(key: string, value: any): void {
    window.localStorage.setItem(key, value);
  }
  clear(): void {
    window.localStorage.clear();
  }
  getKeys(): string[] {
    return Object.keys(window.localStorage);
  }
}
