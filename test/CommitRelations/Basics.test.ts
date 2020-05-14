import { expect } from 'chai';
import { Updateness } from '../../src/model/Updateness';
import {
  createStore,
  createTwoItems,
  commitRelationChange,
  relUpness
} from './helpers';

describe('Commit relations - basics', () => {
  it('create a relation, then remove it', () => {
    const store = createStore();
    const { parentItemId, childItemId } = createTwoItems(store);

    commitRelationChange(store, {
      type: 'AddRelation',
      parentItemId,
      childItemId
    });

    const parent = store.getItem(parentItemId);
    const child = store.getItem(childItemId);
    expect(parent.getChildren()).deep.equals([childItemId]);
    expect(child.getParents()).deep.equals([parentItemId]);

    commitRelationChange(store, {
      type: 'RemoveRelation',
      parentItemId,
      childItemId
    });

    expect(relUpness(store, parentItemId)).equals(Updateness.GoneLocal);
    expect(relUpness(store, childItemId)).equals(Updateness.GoneLocal);
  });
});
