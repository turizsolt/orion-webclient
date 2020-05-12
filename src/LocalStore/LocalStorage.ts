export interface LocalStorage {
  getItem(key: string): any;
  setItem(key: string, value: any): void;
  clear(): void;
}
