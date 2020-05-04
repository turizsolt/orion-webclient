import openSocket from 'socket.io-client';
declare var window: any;

let sock;

try {
  sock = openSocket(window.socketIoUrl);
} catch {
  sock = { on: () => {}, emit: () => {} };
}

export const socket = sock;
