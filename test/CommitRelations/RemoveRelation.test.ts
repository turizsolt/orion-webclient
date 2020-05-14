import { expect } from 'chai';
import { Updateness } from '../../src/model/Updateness';
import {
  createStore,
  createTwoItems,
  commitRelationChange,
  relUpness,
  relCount
} from './helpers';
import { ChangeResponse } from '../../src/model/Change/Change';

describe('Commit relations - remove relation', () => {
  it('remove a relation, and accept it', () => {
    const store = createStore();
    const { parentItemId, childItemId } = createTwoItems(store);

    commitRelationChange(store, {
      type: 'AddRelation',
      parentItemId,
      childItemId,
      response: ChangeResponse.Happened
    });

    commitRelationChange(store, {
      type: 'RemoveRelation',
      parentItemId,
      childItemId
    });

    commitRelationChange(store, {
      type: 'RemoveRelation',
      parentItemId,
      childItemId,
      response: ChangeResponse.Accepted
    });

    expect(relCount(store, parentItemId)).equals(0);
    expect(relCount(store, childItemId)).equals(0);
  });

  it('remove a relation, and rejects it', () => {
    const store = createStore();
    const { parentItemId, childItemId } = createTwoItems(store);

    commitRelationChange(store, {
      type: 'RemoveRelation',
      parentItemId,
      childItemId
    });

    commitRelationChange(store, {
      type: 'RemoveRelation',
      parentItemId,
      childItemId,
      response: ChangeResponse.Rejected
    });

    expect(relCount(store, parentItemId)).equals(0);
    expect(relCount(store, childItemId)).equals(0);
  });

  it('happens removing a relation', () => {
    const store = createStore();
    const { parentItemId, childItemId } = createTwoItems(store);

    commitRelationChange(store, {
      type: 'RemoveRelation',
      parentItemId,
      childItemId,
      response: ChangeResponse.Happened
    });

    expect(relCount(store, parentItemId)).equals(0);
    expect(relCount(store, childItemId)).equals(0);
  });
});
