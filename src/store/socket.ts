import openSocket from 'socket.io-client';
import { store } from '.';
import { createItem, updateItem, getAllItem } from './actions';

let sock;

try {
  sock = openSocket('http://localhost:3000');
} catch {
  sock = { on: () => {}, emit: () => {} };
}

export const socket = sock;

const createdItemReceived = (change: any) => {
  store.dispatch(createItem.done({ params: change, result: change }));
};

socket.on('createdItem', createdItemReceived);

const updatedItemReceived = (change: any) => {
  store.dispatch(updateItem.done({ params: change, result: change }));
};

socket.on('updatedItem', updatedItemReceived);

const createdAllItemReceived = (changes: any[]) => {
  for (const change of changes) {
    store.dispatch(createItem.done({ params: change, result: change }));
  }
};

socket.on('gotItem', createdItemReceived);
socket.on('gotAllItem', createdAllItemReceived);

setTimeout(() => store.dispatch(getAllItem.started({})), 0);
