import { expect } from 'chai';

export type FieldName = string;
export type ItemId = string;

export interface Change {
  itemId: ItemId;
  field: FieldName;
  oldValue: any;
  newValue: any;
}

export class Transaction {
  private changes: Change[];
  constructor() {
    this.changes = [];
  }

  add(change: Change) {
    this.changes.push(change);
  }
}

export class Store {
  commit(transaction: Transaction) {
    console.log('committed', transaction);
  }

  hasItem(itemId: ItemId): boolean {
    return true;
  }

  getItem(itemId: ItemId): { getField: (field: string) => any } {
    return { getField: (field: string) => 'Lorem Ipsum' };
  }
}

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
    const store = new Store();
    store.commit(transaction);

    expect(store.hasItem(itemId)).equals(true);
    expect(store.getItem(itemId).getField('title')).equals('Lorem Ipsum');
  });
});
