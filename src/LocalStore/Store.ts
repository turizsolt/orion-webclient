import { ItemId } from '../model/Item/ItemId';
import { StoredItem } from '../model/Item/StoredItem';
import {
  ServerGetItem,
  Change,
  ChangeResponse,
  ItemChange
} from '../model/Change/Change';
import { ViewItem } from '../model/Item/ViewItem';
import {
  updateItem,
  createItemList,
  addToItems,
  updateChange
} from '../ReduxStore/actions';
import { RelationType, oppositeOf } from '../model/Relation/RelationType';
import { FieldTypeOf } from '../model/Item/FieldTypeOf';
import { Updateness } from '../model/Updateness';
import { Transaction } from '../model/Transaction/Transaction';
import { ActualIdGenerator } from '../idGenerator/ActualIdGenerator';
import { Dispatcher } from './Dispatcher';
import { LocalStorage } from './LocalStorage';
import { ServerCommunication } from './ServerCommunication';
import { ChangeId } from '../model/Change/ChangeId';
import { TransactionId } from '../model/Transaction/TransactionId';
import { THEIRS } from '../model/OursTheirs';
import { AffectedChanges } from '../model/AffectedChanges';
import { ViewChange } from '../model/Change/ViewChange';

const idGen = new ActualIdGenerator();

export class Store {
  private items: Record<ItemId, StoredItem> = {};
  private itemList: ItemId[] = [];
  private transactions: Record<TransactionId, Transaction> = {};
  private transactionList: TransactionId[] = [];
  private changes: Record<ChangeId, Change> = {};
  private changeList: ChangeId[] = [];

  constructor(
    private dispatcher: Dispatcher,
    private localStorage: LocalStorage,
    private serverCommunication: ServerCommunication
  ) {
    for (let key of this.localStorage.getKeys()) {
      if (!key.startsWith('item-')) continue;

      const value = this.localStorage.getItem(key);
      const id = key.substr(5); // "item-${id}"
      if (value) {
        this.items[id] = StoredItem.deserialise(value);
        this.updateItem(id);
        this.itemList.push(id);
      }
    }
    this.dispatcher.dispatch(createItemList(this.itemList));
  }

  loadItemIfNotPresentWithDispatch(id: ItemId) {
    if (!this.items[id]) {
      this.load(id);
      this.dispatcher.dispatch(addToItems(id));
    }
  }

  loadItemIfNotPresent(id: ItemId) {
    if (!this.items[id]) {
      this.load(id);
    }
  }

  load(id: ItemId) {
    const value = this.localStorage.getItem(`item-${id}`);
    if (value) {
      this.items[id] = StoredItem.deserialise(value);
    } else {
      this.items[id] = new StoredItem(id);
    }
    this.itemList.push(id);
  }

  allItem(getItems: ServerGetItem[]): void {
    for (const item of getItems) {
      const { id, changes, relations } = item;
      this.loadItemIfNotPresent(id);
      const storedItem = this.items[id];

      for (let ch of changes) {
        const { field, serverValue } = ch;

        if (!storedItem.hasField(field)) {
          storedItem.setField(field, serverValue);
          storedItem.setFieldUpdateness(field, Updateness.UpToDate);
        } else if (storedItem.hasConflict(field)) {
          storedItem.setAuxilaryField(THEIRS, field, serverValue);
        } else {
          const chg = storedItem.getFieldChange(field);

          if (!chg || (chg && chg.oldValue === serverValue)) {
            storedItem.setField(field, serverValue);
            storedItem.setFieldUpdateness(field, Updateness.UpToDate);
          } else {
            storedItem.setConflict(
              field,
              storedItem.getField(field),
              serverValue
            );
          }
        }
      }

      for (const rel of relations) {
        if (storedItem.hasRelation(rel.type, rel.otherSideId)) {
          storedItem.addRelationAccepted(rel.type, rel.otherSideId);
        } else {
          storedItem.addRelation(rel.type, rel.otherSideId);
          storedItem.addRelationAccepted(rel.type, rel.otherSideId);
        }
      }

      for (const rel of storedItem.getRelations()) {
        const index = relations.findIndex(
          x => x.type === rel.type && x.otherSideId === rel.otherSideId
        );
        if (index === -1) {
          if (rel.updateness === Updateness.UpToDate) {
            storedItem.removeRelationAccepted(rel.type, rel.otherSideId);
          }
        }
      }
      // todo update ItemSSSSS, one block outer
      this.updateItem(id);
    }

    this.sendRecentChanges();
  }

  sendRecentChanges() {
    // todo bulk send
    console.log('send recent', this.changes);
    for (const key of Object.keys(this.changes)) {
      this.serverCommunication.emit('changeItem', this.changes[key]);
    }
  }

  addRelation(oneSideId: ItemId, relation: RelationType, otherSideId: ItemId) {
    this.addRelationHandle(oneSideId, relation, otherSideId);
    this.serverCommunication.emit('addRelation', {
      oneSideId,
      relation,
      otherSideId,
      changeId: idGen.generate()
    });
  }

  addRelationHandle(
    oneSideId: ItemId,
    relation: RelationType,
    otherSideId: ItemId
  ) {
    this.items[oneSideId].addRelation(relation, otherSideId);
    this.items[otherSideId].addRelation(oppositeOf(relation), oneSideId);

    this.updateItem(oneSideId);
    this.updateItem(otherSideId);
  }

  addRelationAccepted(
    oneSideId: ItemId,
    relation: RelationType,
    otherSideId: ItemId
  ) {
    this.items[oneSideId].addRelationAccepted(relation, otherSideId);
    this.items[otherSideId].addRelationAccepted(
      oppositeOf(relation),
      oneSideId
    );

    this.updateItem(oneSideId);
    this.updateItem(otherSideId);
  }

  addRelationHappened(
    oneSideId: ItemId,
    relation: RelationType,
    otherSideId: ItemId
  ) {
    this.addRelationHandle(oneSideId, relation, otherSideId);
    this.addRelationAccepted(oneSideId, relation, otherSideId);
  }

  removeRelation(
    oneSideId: ItemId,
    relation: RelationType,
    otherSideId: ItemId
  ) {
    this.removeRelationHandle(oneSideId, relation, otherSideId);
    this.serverCommunication.emit('removeRelation', {
      oneSideId,
      relation,
      otherSideId,
      changeId: idGen.generate()
    });
  }

  removeRelationHandle(
    oneSideId: ItemId,
    relation: RelationType,
    otherSideId: ItemId
  ) {
    this.items[oneSideId].removeRelation(relation, otherSideId);
    this.items[otherSideId].removeRelation(oppositeOf(relation), oneSideId);

    this.updateItem(oneSideId);
    this.updateItem(otherSideId);
  }

  removeRelationAccepted(
    oneSideId: ItemId,
    relation: RelationType,
    otherSideId: ItemId
  ) {
    this.items[oneSideId].removeRelationAccepted(relation, otherSideId);
    this.items[otherSideId].removeRelationAccepted(
      oppositeOf(relation),
      oneSideId
    );

    this.updateItem(oneSideId);
    this.updateItem(otherSideId);
  }

  removeRelationHappened(
    oneSideId: ItemId,
    relation: RelationType,
    otherSideId: ItemId
  ) {
    this.removeRelationHandle(oneSideId, relation, otherSideId);
    this.removeRelationAccepted(oneSideId, relation, otherSideId);
  }

  updateItemSoon(id: ItemId) {
    const storedItem = this.items[id];
    setTimeout(() => {
      storedItem.updateJustUpdatesToUpToDate();
      this.updateItem(id);
    }, 1500);
  }

  updateItem(id: ItemId) {
    const viewItem = this.getView(id);
    this.dispatcher.dispatch(updateItem(viewItem));
    this.localStorage.setItem(`item-${id}`, this.items[id].serialise());
    if (this.items[id].getUpdateness() === Updateness.JustUpdated) {
      this.updateItemSoon(id);
    }
  }

  updateChange(changeId: ChangeId) {
    const viewChange: ViewChange = this.getChange(changeId);
    this.dispatcher.dispatch(updateChange(viewChange));
    this.localStorage.setItem(
      `change-${changeId}`,
      JSON.stringify(this.changes[changeId])
    );
  }

  getView(id: ItemId): ViewItem {
    const auxilaryColumns = this.items[id].getAuxilaryNames();
    return {
      id,
      fields: this.getViewFields(id, auxilaryColumns),
      originalFields: this.items[id].getOriginalFields(),
      auxilaryColumns,
      children: this.items[id].getChildren(),
      parents: this.items[id].getParents(),
      updateness: this.items[id].getUpdateness()
    };
  }

  private getViewFields(id: ItemId, auxilaryColumns: string[]) {
    const fields = [];
    for (let field of this.items[id].getFields()) {
      if (this.items[id].getField(field) !== undefined) {
        fields.push({
          name: field,
          ...FieldTypeOf(field),
          value: this.items[id].getField(field),
          updateness: this.items[id].getFieldUpdateness(field),
          auxilaryValues: auxilaryColumns.map(name =>
            this.items[id].getAuxilaryField(name, field)
          )
        });
      }
    }
    return fields;
  }

  /*** neu ***/

  hasItem(id: ItemId): boolean {
    return !!this.items[id];
  }

  getItem(id: ItemId): StoredItem {
    return this.items[id];
  }

  getLastTransaction(): Transaction {
    return this.transactions[
      this.transactionList[this.transactionList.length - 1]
    ];
  }

  getLastChange(): Change {
    return this.changes[this.changeList[this.changeList.length - 1]];
  }

  getTransactionList(): TransactionId[] {
    return this.transactionList;
  }

  getChangeList(): ChangeId[] {
    return this.changeList;
  }

  hasChange(changeId: ChangeId): boolean {
    return !!this.changes[changeId];
  }

  getChange(changeId: ChangeId): Change {
    return this.changes[changeId];
  }

  changeItem2(change: ItemChange): AffectedChanges {
    this.loadItemIfNotPresentWithDispatch(change.itemId);
    const storedItem = this.items[change.itemId];
    let modifiedChange = change;
    const affectedItems = [change.itemId];
    const affectedChanges = [change.changeId];

    if (change.response === ChangeResponse.Rejected) {
      storedItem.setConflict(change.field, change.newValue, change.oldValue);
      storedItem.setFieldUpdateness(
        change.field,
        this.updatenessFromResponse(change.response)
      );
    } else if (
      change.response === ChangeResponse.Pending &&
      storedItem.hasConflict(change.field)
    ) {
      modifiedChange = {
        ...change,
        oldValue: storedItem.getAuxilaryField(THEIRS, change.field)
      };

      storedItem.setField(change.field, change.newValue);
      storedItem.setFieldUpdateness(
        change.field,
        this.updatenessFromResponse(change.response)
      );
      storedItem.resolveConflict(change.field);
    } else if (
      change.response === ChangeResponse.Happened &&
      storedItem.willConflict(change.field, change.oldValue)
    ) {
      storedItem.setConflict(
        change.field,
        storedItem.getField(change.field),
        change.newValue
      );

      const lastChange = storedItem.getFieldChange(change.field);
      if (lastChange) {
        this.changes[lastChange.changeId].response = ChangeResponse.Rejected;
        affectedChanges.push(lastChange.changeId);
      }
    } else {
      storedItem.setField(change.field, change.newValue);
      storedItem.setFieldUpdateness(
        change.field,
        this.updatenessFromResponse(change.response)
      );
    }

    if (change.response === ChangeResponse.Pending) {
      storedItem.setFieldChange(change.field, change);
    } else {
      storedItem.removeFieldChange(change.field);
    }

    return {
      changes: [modifiedChange],
      affectedItems,
      affectedChanges
    };
  }

  updatenessFromResponse(response: ChangeResponse): Updateness {
    switch (response) {
      case ChangeResponse.Pending:
        return Updateness.Local;

      case ChangeResponse.Accepted:
        return Updateness.JustUpdated;

      case ChangeResponse.Rejected:
        return Updateness.Conflict;

      case ChangeResponse.Happened:
        return Updateness.JustUpdated;
    }
  }

  private addFn: Record<ChangeResponse, Function> = {
    [ChangeResponse.Pending]: this.addRelation,
    [ChangeResponse.Accepted]: this.addRelationAccepted,
    [ChangeResponse.Happened]: this.addRelationHappened,
    [ChangeResponse.Rejected]: this.addRelationAccepted
  };

  private remFn: Record<ChangeResponse, Function> = {
    [ChangeResponse.Pending]: this.removeRelation,
    [ChangeResponse.Accepted]: this.removeRelationAccepted,
    [ChangeResponse.Happened]: this.removeRelationHappened,
    [ChangeResponse.Rejected]: this.removeRelationAccepted
  };

  commit(transaction: Transaction) {
    const affectedItems = new Set<ItemId>();
    const affectedChanges = new Set<ChangeId>();

    for (const change of transaction.getChanges()) {
      switch (change.type) {
        case 'ItemChange':
          const proced = this.changeItem2(change);
          // to server processed.changes

          // másik kettőnek meg a Redux felé
          proced.affectedItems.map(itemId => affectedItems.add(itemId));
          proced.affectedChanges.map(changeId => affectedChanges.add(changeId));
          break;

        case 'AddRelation':
          this.addFn[change.response].call(
            this,
            change.oneSideId,
            change.relation,
            change.otherSideId
          );
          break;

        case 'RemoveRelation':
          this.remFn[change.response].call(
            this,
            change.oneSideId,
            change.relation,
            change.otherSideId
          );
          break;
      }

      const changeId = change.changeId;
      if (!this.changes[changeId]) {
        this.changeList.push(changeId);
      }
      this.changes[changeId] = change;
    }

    const transId = transaction.getId();
    if (!this.transactions[transId]) {
      this.transactionList.push(transId);
    }
    this.transactions[transId] = transaction;

    affectedItems.forEach((itemId: ItemId) => this.updateItem(itemId));
    affectedChanges.forEach((changeId: ChangeId) =>
      this.updateChange(changeId)
    );
  }
}