import { expect } from 'chai';
import { Store } from '../src/LocalStore/Store';
import { VoidDispatcher } from '../src/LocalStore/VoidDispatcher';
import { VoidLocalStorage } from '../src/LocalStore/VoidLocalStorage';
import { VoidServerCommunication } from '../src/LocalStore/VoidServerCommunication';
import { Change, ChangeResponse } from '../src/model/Change/Change';
import { Transaction } from '../src/model/Transaction/Transaction';
import { RelationType } from '../src/model/Relation/RelationType';
import { Updateness } from '../src/model/Updateness';
import { ActualIdGenerator } from '../src/idGenerator/ActualIdGenerator';

const idGen = new ActualIdGenerator();

const createStore = (): Store => {
  return new Store(
    new VoidDispatcher(),
    new VoidLocalStorage(),
    new VoidServerCommunication()
  );
};

describe('Commit relations', () => {
  it('create a relation, then remove it', () => {
    const store = createStore();

    const parentItemId = '1';
    const change1: Change = {
      type: 'ItemChange',
      itemId: parentItemId,
      field: 'title',
      oldValue: undefined,
      newValue: 'Parent',
      changeId: idGen.generate(),
      response: ChangeResponse.Pending
    };

    const childItemId = '2';
    const change2: Change = {
      type: 'ItemChange',
      itemId: childItemId,
      field: 'title',
      oldValue: undefined,
      newValue: 'Children',
      changeId: idGen.generate(),
      response: ChangeResponse.Pending
    };

    const transaction = new Transaction();
    transaction.add(change1);
    transaction.add(change2);

    store.commit(transaction);

    const changeRel: Change = {
      type: 'AddRelation',
      oneSideId: parentItemId,
      relation: RelationType.Child,
      otherSideId: childItemId,
      changeId: '8',
      response: ChangeResponse.Pending
    };

    const transactionRel = new Transaction();
    transactionRel.add(changeRel);

    store.commit(transactionRel);

    expect(store.getItem(parentItemId).getChildren()).deep.equals([
      childItemId
    ]);
    expect(store.getItem(childItemId).getParents()).deep.equals([parentItemId]);

    // step 2 remove

    const changeRel2: Change = {
      type: 'RemoveRelation',
      oneSideId: parentItemId,
      relation: RelationType.Child,
      otherSideId: childItemId,
      changeId: '9',
      response: ChangeResponse.Pending
    };

    const transactionRel2 = new Transaction();
    transactionRel2.add(changeRel2);

    store.commit(transactionRel2);

    expect(store.getItem(parentItemId).getRelations()[0].updateness).equals(
      Updateness.GoneLocal
    );
    expect(store.getItem(childItemId).getRelations()[0].updateness).equals(
      Updateness.GoneLocal
    );
  });
});
