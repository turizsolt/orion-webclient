import { LocalStorage } from './LocalStorage';

export class VoidLocalStorage implements LocalStorage {
  getItem(key: string): any {}
  setItem(key: string, value: any): void {}
  clear(): void {}
  getKeys(): string[] {
    return [];
  }
}
