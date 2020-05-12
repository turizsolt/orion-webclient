import { Store } from './Store';
import { ChangeItem } from '../model/Change/Change';
import { ItemId } from '../model/Item/ItemId';
import { RelationType } from '../model/Relation/RelationType';
import { Dispatcher } from './Dispatcher';
import { initServerSocket } from './initServerSocket';
import { LocalStorage } from './LocalStorage';
import { ServerCommunication } from './ServerCommunication';

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

  changeItem(change: ChangeItem): void {
    this.store.changeItem(change);
  }

  createItem(): ItemId {
    return this.store.createItem();
  }

  addRelation(
    oneId: ItemId,
    relationType: RelationType,
    otherId: ItemId
  ): void {
    this.store.addRelation(oneId, relationType, otherId);
  }

  removeRelation(
    oneId: ItemId,
    relationType: RelationType,
    otherId: ItemId
  ): void {
    this.store.removeRelation(oneId, relationType, otherId);
  }
}
