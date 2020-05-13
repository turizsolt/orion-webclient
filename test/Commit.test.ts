import { expect } from 'chai';
import { ChangeResponse } from '../src/model/Change/Change';
import { Updateness } from '../src/model/Updateness';
import { OURS, THEIRS } from '../src/model/OursTheirs';
import {
  createStore,
  LOREM_IPSUM,
  commitItemChange,
  FIELD,
  SOMETHING_ELSE
} from './Commit.helpers';

describe('Commit', () => {
  it('create an item', () => {
    const store = createStore();
    const { itemId, change, transaction } = commitItemChange(store, {
      newValue: LOREM_IPSUM
    });

    expect(store.hasItem(itemId)).equals(true);
    expect(store.getItem(itemId).getField(FIELD)).equals(LOREM_IPSUM);
    expect(store.getItem(itemId).getUpdateness()).equals(Updateness.Local);

    expect(store.getLastTransaction()).equals(transaction);
    expect(store.getLastChange()).equals(change);
  });

  it('create an item, server accepts it', () => {
    const store = createStore();

    const { itemId, change, transaction } = commitItemChange(store, {
      newValue: LOREM_IPSUM
    });

    commitItemChange(store, {
      itemId,
      changeId: change.changeId,
      transactionId: transaction.getId(),
      newValue: LOREM_IPSUM,
      response: ChangeResponse.Accepted
    });

    const item = store.getItem(itemId);
    expect(item.getField(FIELD)).equals(LOREM_IPSUM);
    expect(item.getUpdateness()).equals(Updateness.JustUpdated);

    expect(store.getChangeList().length).equals(1);
    expect(store.getTransactionList().length).equals(1);
  });

  it('create an item, server rejects it, then resolving', () => {
    const store = createStore();

    const { itemId, change, transaction } = commitItemChange(store, {
      newValue: LOREM_IPSUM
    });

    commitItemChange(store, {
      itemId,
      changeId: change.changeId,
      transactionId: transaction.getId(),
      oldValue: SOMETHING_ELSE,
      newValue: LOREM_IPSUM,
      response: ChangeResponse.Rejected
    });

    const item = store.getItem(itemId);
    expect(item.getUpdateness()).equals(Updateness.Conflict);
    expect(item.getFieldUpdateness(FIELD)).equals(Updateness.Conflict);

    expect(item.getField(FIELD)).equals(LOREM_IPSUM);
    expect(item.getAuxilaryField(OURS, FIELD)).equals(LOREM_IPSUM);
    expect(item.getAuxilaryField(THEIRS, FIELD)).equals(SOMETHING_ELSE);

    expect(store.getChangeList().length).equals(1);
    expect(store.getTransactionList().length).equals(1);

    commitItemChange(store, {
      itemId,
      oldValue: SOMETHING_ELSE,
      newValue: LOREM_IPSUM
    });

    const resolvedItem = store.getItem(itemId);
    expect(resolvedItem.getUpdateness()).equals(Updateness.Resolved);
    expect(resolvedItem.getFieldUpdateness(FIELD)).equals(Updateness.Resolved);

    expect(resolvedItem.getField(FIELD)).equals(LOREM_IPSUM);
    expect(resolvedItem.getAuxilaryField(OURS, FIELD)).equals(undefined);
    expect(resolvedItem.getAuxilaryField(THEIRS, FIELD)).equals(undefined);
  });

  it('happened a creation somewhere', () => {
    const store = createStore();

    const { itemId } = commitItemChange(store, {
      newValue: LOREM_IPSUM,
      response: ChangeResponse.Happened
    });

    const item = store.getItem(itemId);
    expect(item.getUpdateness()).equals(Updateness.JustUpdated);
    expect(item.getField(FIELD)).equals(LOREM_IPSUM);

    expect(store.getChangeList().length).equals(1);
    expect(store.getTransactionList().length).equals(1);
  });

  it('happened a creation somewhere, and conflicting to local', () => {
    const store = createStore();

    const { itemId } = commitItemChange(store, {
      newValue: LOREM_IPSUM
    });

    commitItemChange(store, {
      itemId,
      oldValue: undefined,
      newValue: SOMETHING_ELSE,
      response: ChangeResponse.Happened
    });

    const item = store.getItem(itemId);
    expect(item.getUpdateness()).equals(Updateness.Conflict);
    expect(item.getField(FIELD)).equals(LOREM_IPSUM);
    expect(item.getAuxilaryField(OURS, FIELD)).equals(LOREM_IPSUM);
    expect(item.getAuxilaryField(THEIRS, FIELD)).equals(SOMETHING_ELSE);

    expect(store.getChangeList().length).equals(2);
    expect(store.getTransactionList().length).equals(2);
  });
});
