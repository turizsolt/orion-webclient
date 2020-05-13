import { Store } from './Store';
import {
  ChangeResponse,
  RelationChange,
  ItemChange
} from '../model/Change/Change';
import { ItemId } from '../model/Item/ItemId';
import { RelationType } from '../model/Relation/RelationType';
import { Dispatcher } from './Dispatcher';
import { initServerSocket } from './initServerSocket';
import { LocalStorage } from './LocalStorage';
import { ServerCommunication } from './ServerCommunication';
import { FieldName } from '../model/Item/FieldName';
import { ActualIdGenerator } from '../idGenerator/ActualIdGenerator';
import { Transaction } from '../model/Transaction/Transaction';

const idGen = new ActualIdGenerator();

export class Actions {
  private store: Store;
  constructor(
    dispatcher: Dispatcher,
    localStorage: LocalStorage,
    serverCommunication: ServerCommunication
  ) {
    this.store = new Store(dispatcher, localStorage, serverCommunication);
    initServerSocket(this.store);
  }

  getStore(): Store {
    return this.store;
  }

  changeItem(
    itemId: ItemId,
    field: FieldName,
    oldValue: any,
    newValue: any
  ): void {
    const change: ItemChange = {
      type: 'ItemChange',
      itemId,
      changeId: idGen.generate(),
      field,
      oldValue,
      newValue,
      response: ChangeResponse.Pending
    };
    const transaction = new Transaction();
    transaction.add(change);
    this.store.commit(transaction);
  }

  createItem(field: FieldName, newValue: any): ItemId {
    const change: ItemChange = {
      type: 'ItemChange',
      itemId: idGen.generate(),
      changeId: idGen.generate(),
      field,
      oldValue: undefined,
      newValue,
      response: ChangeResponse.Pending
    };
    const transaction = new Transaction();
    transaction.add(change);
    this.store.commit(transaction);

    return change.itemId;
  }

  addRelation(
    oneId: ItemId,
    relationType: RelationType,
    otherId: ItemId
  ): void {
    const change: RelationChange = {
      type: 'AddRelation',
      oneSideId: oneId,
      relation: relationType,
      otherSideId: otherId,
      changeId: idGen.generate(),
      response: ChangeResponse.Pending
    };
    const transaction = new Transaction();
    transaction.add(change);
    this.store.commit(transaction);
  }

  removeRelation(
    oneId: ItemId,
    relationType: RelationType,
    otherId: ItemId
  ): void {
    const change: RelationChange = {
      type: 'RemoveRelation',
      oneSideId: oneId,
      relation: relationType,
      otherSideId: otherId,
      changeId: idGen.generate(),
      response: ChangeResponse.Pending
    };
    const transaction = new Transaction();
    transaction.add(change);
    this.store.commit(transaction);
  }
}
