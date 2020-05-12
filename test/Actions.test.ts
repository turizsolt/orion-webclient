import { expect } from 'chai';
import { Store } from '../src/LocalStore/Store';
import { VoidDispatcher } from '../src/LocalStore/VoidDispatcher';
import { VoidLocalStorage } from '../src/LocalStore/VoidLocalStorage';
import { Change } from '../src/model/Change/Change';
import { Transaction } from '../src/model/Transaction/Transaction';

describe('Actions', () => {
  it('create an item', () => {
    const itemId = '1234567890';
    const change: Change = {
      itemId,
      field: 'title',
      oldValue: undefined,
      newValue: 'Lorem Ipsum'
    };
    const transaction = new Transaction();
    transaction.add(change);
    const store = new Store(new VoidDispatcher(), new VoidLocalStorage());
    store.commit(transaction);

    expect(store.hasItem(itemId)).equals(true);
    expect(store.getItem(itemId).getField('title')).equals('Lorem Ipsum');
  });
});
