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
import {
  hoverItem,
  draggedItem,
  toggleFilter,
  search,
  order
} from '../ReduxStore/actions';

const idGen = new ActualIdGenerator();

export class Actions {
  private store: Store;
  constructor(
    private dispatcher: Dispatcher,
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
    if (oldValue === newValue) return;

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

  hover(
    newHover: {
      path: string;
      place: string;
      id: ItemId;
      parentId: ItemId | null;
    } | null
  ) {
    this.dispatcher.dispatch(hoverItem(newHover));
  }

  dragged(itemId: ItemId | null) {
    this.dispatcher.dispatch(draggedItem(itemId));
  }

  toggleFilter(filterId: string) {
    this.dispatcher.dispatch(toggleFilter(filterId));
  }

  search(searchString: string) {
    this.dispatcher.dispatch(search(searchString));
  }

  order(props: { attribute?: string; asc?: boolean }) {
    this.dispatcher.dispatch(order(props));
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
