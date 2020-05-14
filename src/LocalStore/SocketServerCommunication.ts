export class SocketServerCommunication {
  constructor(private socket: any) {}

  emit(messageType: string, message: any): void {
    this.socket.emit(messageType, message);
  }

  on(messageType: string, callback: (message: any) => void): void {
    this.socket.on(messageType, callback);
  }
}
