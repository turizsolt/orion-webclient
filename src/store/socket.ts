import openSocket from 'socket.io-client';
import { store } from '.';
import { createItem } from './actions';

let sock;

try {
  sock = openSocket('http://localhost:3000');
} catch {
  sock = { on: () => {}, emit: () => {} };
}

export const socket = sock;

const createdItemReceived = (item: any) => {
  store.dispatch(createItem.done({ params: item, result: item }));
};

socket.on('createdItem', createdItemReceived);

/*

const createdAllItem = (items: any[]) => {
  for (const item of items) {
    store.dispatch({ type: 'CREATED_ITEM', payload: item });
  }
};

const updatedItem = (item: any) => {
  store.dispatch({ type: 'UPDATED_ITEM', payload: item });
};


socket.on('gotItem', createdItem);
socket.on('updatedItem', updatedItem);
socket.on('gotAllItem', createdAllItem);

setTimeout(() => store.dispatch({ type: 'GET_ALL_ITEM' }), 0);
*/
