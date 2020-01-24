import openSocket from 'socket.io-client';
import { store } from '.';
import { createItem, updateItem } from './actions';

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
/*

const createdAllItem = (items: any[]) => {
  for (const item of items) {
    store.dispatch({ type: 'CREATED_ITEM', payload: item });
  }
};




socket.on('gotItem', createdItem);

socket.on('gotAllItem', createdAllItem);

setTimeout(() => store.dispatch({ type: 'GET_ALL_ITEM' }), 0);
*/
