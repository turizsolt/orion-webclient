import { Store } from './Store';
import { ChangeItem } from '../model/Change/Change';
import { ItemId } from '../model/Item/ItemId';
import { RelationType } from '../model/Relation/RelationType';
import { Dispatcher } from './Dispatcher';
import { DefaultLocalStorage } from './DefaultLocalStorage';
import { SocketServerCommunication } from './SocketServerCommunication';
import { socket } from '../socket';
import { initServerSocket } from './initServerSocket';

export class Actions {
  private store: Store;
  constructor(dispatcher: Dispatcher) {
    this.store = new Store(
      dispatcher,
      new DefaultLocalStorage(),
      new SocketServerCommunication(socket)
    );
    initServerSocket(this.store);
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
