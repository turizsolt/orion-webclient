export interface ServerCommunication {
  emit(messageType: string, message: any): void;
  on(messageType: string, callback: (message: any) => void): void;
  open(): void;
  connected(): boolean;
}
