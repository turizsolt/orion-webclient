import { socket } from '../socket';
import { Store } from './Store';
import { Transaction } from '../model/Transaction/Transaction';
import { LocalStorage } from './LocalStorage';

export const initServerSocket = (store: Store, localStorage: LocalStorage) => {
  socket.on('transaction', (data: any) => {
    const transaction = new Transaction(data.transactionId, data.changes);
    store.commit(transaction, true);
  });

  socket.on('allItem', (data: any) => {
    const transaction = new Transaction(data.transactionId, data.changes);
    store.commit(transaction, true);
  });

  socket.on('stillalive', (data: any) => {
    store.updateAlive(data.time);
  });

  socket.on('connect', () => {
    store.updateAlive((new Date()).getTime(), 'connected');
    socket.emit('authenticate', { token: localStorage.getItem('loginToken') });
  });

  socket.on('authenticated', () => {
    store.updateAlive((new Date()).getTime(), 'authenticated');
  });

  socket.on('unauthorized', (msg:any) => {
    store.updateAlive((new Date()).getTime(), 'unauthorized'); //${JSON.stringify(msg.data)}
  });

  socket.on('disconnect', () => {
    store.updateAlive((new Date()).getTime(), 'disconnected');
  });

  socket.on('reconnect', () => {
    store.updateAlive((new Date()).getTime(), 'reconnected');
  });
};
