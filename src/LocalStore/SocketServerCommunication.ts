import { ServerCommunication } from "./ServerCommunication";

export class SocketServerCommunication implements ServerCommunication {
  constructor(private socket: any) {}

  emit(messageType: string, message: any): void {
    this.socket.emit(messageType, message);
  }

  on(messageType: string, callback: (message: any) => void): void {
    this.socket.on(messageType, callback);
  }

  open(): void {
    if(this.socket.connected) {
        this.socket.close();
    } else {
        this.socket.open();
    }
  }

  connected(): boolean {
      return this.socket.connected;
  }
}
