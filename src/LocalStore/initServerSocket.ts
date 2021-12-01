import { socket } from '../socket';
import { Store } from './Store';
import { Transaction } from '../model/Transaction/Transaction';

export const initServerSocket = (store: Store) => {
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
  });

  socket.on('disconnect', () => {
    store.updateAlive((new Date()).getTime(), 'disconnected');
  });

  socket.on('reconnect', () => {
    store.updateAlive((new Date()).getTime(), 'reconnected');
  });
};
