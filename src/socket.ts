import openSocket from 'socket.io-client';
declare var window: any;

let sock;

try {
  sock = openSocket(window.socketIoUrl);
} catch {
  sock = { on: () => {}, emit: () => {}, open: () => {}, connected: false };
}

export const socket = sock;
