import openSocket from 'socket.io-client';

let sock;

try {
  // sock = openSocket('http://api.orion.zsiri.eu:80/');
  sock = openSocket('http://localhost:8902/');
} catch {
  sock = { on: () => {}, emit: () => {} };
}

export const socket = sock;
