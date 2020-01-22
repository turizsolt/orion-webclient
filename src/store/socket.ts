import openSocket from 'socket.io-client';
import { store } from '.';

let sock;

try {
  sock = openSocket('http://localhost:3000');
} catch {
  sock = { on: () => {}, emit: () => {} };
}

export const socket = sock;

const addItem = (item: any) => {
  store.dispatch({ type: 'CREATED_ITEM', payload: item });
};

socket.on('createdItem', addItem);
socket.on('gotItem', addItem);
