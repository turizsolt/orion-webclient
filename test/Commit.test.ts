import { expect } from 'chai';
import { Store } from '../src/LocalStore/Store';
import { VoidDispatcher } from '../src/LocalStore/VoidDispatcher';
import { VoidLocalStorage } from '../src/LocalStore/VoidLocalStorage';
import { VoidServerCommunication } from '../src/LocalStore/VoidServerCommunication';
import { Change } from '../src/model/Change/Change';
import { Transaction } from '../src/model/Transaction/Transaction';
import { RelationType } from '../src/model/Relation/RelationType';
import { Updateness } from '../src/model/Updateness';
import { ActualIdGenerator } from '../src/idGenerator/ActualIdGenerator';

const idGen = new ActualIdGenerator();

describe('Commit', () => {
  it('create an item', () => {
    const itemId = '1234567890';
    const change: Change = {
      type: 'ItemChange',
      itemId,
      field: 'title',
      oldValue: undefined,
      newValue: 'Lorem Ipsum',
      changeId: idGen.generate()
    };
    const transaction = new Transaction();
    transaction.add(change);
    const store = new Store(
      new VoidDispatcher(),
      new VoidLocalStorage(),
      new VoidServerCommunication()
    );
    store.commit(transaction);

    expect(store.hasItem(itemId)).equals(true);
    expect(store.getItem(itemId).getField('title')).equals('Lorem Ipsum');
    expect(store.getLastTransaction()).equals(transaction);
    expect(store.getLastChange()).equals(change);
  });

  it('create a relation, then remove it', () => {
    const store = new Store(
      new VoidDispatcher(),
      new VoidLocalStorage(),
      new VoidServerCommunication()
    );

    const parentItemId = '1';
    const change1: Change = {
      type: 'ItemChange',
      itemId: parentItemId,
      field: 'title',
      oldValue: undefined,
      newValue: 'Parent',
      changeId: idGen.generate()
    };

    const childItemId = '2';
    const change2: Change = {
      type: 'ItemChange',
      itemId: childItemId,
      field: 'title',
      oldValue: undefined,
      newValue: 'Children',
      changeId: idGen.generate()
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
      changeId: '8'
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
      changeId: '9'
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
