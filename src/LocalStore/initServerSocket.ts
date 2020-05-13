import { socket } from '../socket';
import { Store } from './Store';
import { Transaction } from '../model/Transaction/Transaction';

export const initServerSocket = (store: Store) => {
  socket.on('transaction', (data: any) => {
    console.log('ta', data);
    const transaction = new Transaction(data.transactionId, data.changes);
    console.log(transaction);
    store.commit(transaction, true);
  });
};
