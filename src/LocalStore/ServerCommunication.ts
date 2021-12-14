export interface ServerCommunication {
  emit(messageType: string, message: any): void;
  on(messageType: string, callback: (message: any) => void): void;
  toggleOpen(): void;
  open(): void;
  reopen(): void;
  close(): void;
  connected(): boolean;
}
