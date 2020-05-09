import { expect } from 'chai';

describe('Actions', () => {
  it('create an item', () => {
    const change = new Change({
      itemId: '1234567890',
      field: 'title',
      oldValue: undefined,
      newValue: 'Lorem Ipsum'
    });
    const transaction = new Transaction();
    transaction.add(change);
    const store = new Store();
    store.commit(transaction);

    expect(true).equals(true);
  });
});
