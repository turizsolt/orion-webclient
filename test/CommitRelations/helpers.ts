import { Store } from '../../src/LocalStore/Store';
import { VoidDispatcher } from '../../src/LocalStore/VoidDispatcher';
import { VoidLocalStorage } from '../../src/LocalStore/VoidLocalStorage';
import { VoidServerCommunication } from '../../src/LocalStore/VoidServerCommunication';
import {
  Change,
  ChangeResponse,
  ItemChange,
  RelationChange
} from '../../src/model/Change/Change';
import { Transaction } from '../../src/model/Transaction/Transaction';
import { RelationType } from '../../src/model/Relation/RelationType';
import { ActualIdGenerator } from '../../src/idGenerator/ActualIdGenerator';
import { ItemId } from '../../src/model/Item/ItemId';
import { TransactionId } from '../../src/model/Transaction/TransactionId';
import { ChangeId } from '../../src/model/Change/ChangeId';
import { Updateness } from '../../src/model/Updateness';

const idGen = new ActualIdGenerator();

export const createStore = (): Store => {
  return new Store(
    new VoidDispatcher(),
    new VoidLocalStorage(),
    new VoidServerCommunication()
  );
};

interface TwoItemsChangesTransaction {
  parentItemId: ItemId;
  childItemId: ItemId;
  transactionId: TransactionId;
  parentChange: ItemChange;
  childChange: ItemChange;
}

export const createTwoItems = (store: Store): TwoItemsChangesTransaction => {
  const parentItemId = idGen.generate();
  const parentChange: Change = {
    type: 'ItemChange',
    itemId: parentItemId,
    field: 'title',
    oldValue: undefined,
    newValue: 'Parent',
    changeId: idGen.generate(),
    response: ChangeResponse.Pending
  };

  const childItemId = idGen.generate();
  const childChange: Change = {
    type: 'ItemChange',
    itemId: childItemId,
    field: 'title',
    oldValue: undefined,
    newValue: 'Children',
    changeId: idGen.generate(),
    response: ChangeResponse.Pending
  };

  const transaction = new Transaction();
  transaction.add(parentChange);
  transaction.add(childChange);

  store.commit(transaction);

  return {
    parentItemId,
    childItemId,
    transactionId: transaction.getId(),
    parentChange,
    childChange
  };
};

interface Params {
  type?: 'AddRelation' | 'RemoveRelation';
  parentItemId: ItemId;
  childItemId: ItemId;
  changeId?: ChangeId;
  response?: ChangeResponse;
}

interface RetParams {
  change: RelationChange;
  transaction: Transaction;
  changeId: ChangeId;
}

export const commitRelationChange = (
  store: Store,
  params: Params
): RetParams => {
  const change: Change = {
    type: params.type || 'AddRelation',
    oneSideId: params.parentItemId,
    relation: RelationType.Child,
    otherSideId: params.childItemId,
    changeId: params.changeId || idGen.generate(),
    response: params.response || ChangeResponse.Pending
  };

  const transaction = new Transaction();
  transaction.add(change);

  store.commit(transaction);

  return {
    change,
    transaction,
    changeId: change.changeId
  };
};

export const relUpness = (store: Store, itemId: ItemId): Updateness => {
  return store.getItem(itemId).getRelations()[0].updateness;
};

export const relCount = (store: Store, itemId: ItemId): number => {
  return store.getItem(itemId).getRelations().length;
};
