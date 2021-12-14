import { ServerCommunication } from "./ServerCommunication";

export class SocketServerCommunication implements ServerCommunication {
  constructor(private socket: any) {}

  emit(messageType: string, message: any): void {
    this.socket.emit(messageType, message);
  }

  on(messageType: string, callback: (message: any) => void): void {
    this.socket.on(messageType, callback);
  }

  toggleOpen(): void {
    if(this.socket.connected) {
        this.socket.close();
    } else {
        this.socket.open();
    }
  }

  open(): void {
    this.socket.open();  
  }

  close(): void {
    this.socket.close();
  }

  reopen(): void {
    if(this.socket.connected) {
        this.socket.close();
    }
    this.socket.open();
  }

  connected(): boolean {
      return this.socket.connected;
  }
}
