import { expect } from 'chai';
import { Updateness } from '../../src/model/Updateness';
import {
  createStore,
  createTwoItems,
  commitRelationChange,
  relUpness
} from './helpers';
import { ChangeResponse } from '../../src/model/Change/Change';

describe('Commit relations - add relation', () => {
  it('create a relation, and accept it', () => {
    const store = createStore();
    const { parentItemId, childItemId } = createTwoItems(store);

    commitRelationChange(store, {
      type: 'AddRelation',
      parentItemId,
      childItemId
    });

    commitRelationChange(store, {
      type: 'AddRelation',
      parentItemId,
      childItemId,
      response: ChangeResponse.Accepted
    });

    expect(relUpness(store, parentItemId)).equals(Updateness.UpToDate);
    expect(relUpness(store, childItemId)).equals(Updateness.UpToDate);
  });

  it('create a relation, and rejects it', () => {
    const store = createStore();
    const { parentItemId, childItemId } = createTwoItems(store);

    commitRelationChange(store, {
      type: 'AddRelation',
      parentItemId,
      childItemId
    });

    commitRelationChange(store, {
      type: 'AddRelation',
      parentItemId,
      childItemId,
      response: ChangeResponse.Rejected
    });

    expect(relUpness(store, parentItemId)).equals(Updateness.UpToDate);
    expect(relUpness(store, childItemId)).equals(Updateness.UpToDate);
  });

  it('happens a relation', () => {
    const store = createStore();
    const { parentItemId, childItemId } = createTwoItems(store);

    commitRelationChange(store, {
      type: 'AddRelation',
      parentItemId,
      childItemId,
      response: ChangeResponse.Happened
    });

    expect(relUpness(store, parentItemId)).equals(Updateness.UpToDate);
    expect(relUpness(store, childItemId)).equals(Updateness.UpToDate);
  });
});
