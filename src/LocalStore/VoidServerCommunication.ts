export class VoidServerCommunication {
  emit(messageType: string, message: any): void {}
  on(messageType: string, callback: (message: any) => void): void {}
}
