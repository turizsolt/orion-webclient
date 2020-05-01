import { Store } from 'redux';
import { ItemId } from '../model/Item/ItemId';
import { StoredItem } from '../model/Item/StoredItem';
import { ChangeItem } from '../model/Change/Change';
import { ViewItem } from '../model/Item/ViewItem';
import { updateItem, createList, addToList } from '../ReduxStore/actions';
import { RelationType, oppositeOf } from '../model/Relation/RelationType';
import { FieldTypeOf } from '../model/Item/FieldTypeOf';
import { ActualIdGenerator } from '../idGenerator/ActualIdGenerator';
import { socket } from '../socket';
import { Updateness } from '../model/Updateness';
import { createTemplate } from './CreateTemplate';
import { throwStatement } from '@babel/types';

const idGen = new ActualIdGenerator();

export class LocalStore {
  private store: Record<ItemId, StoredItem>;
  private list: ItemId[];
  private reduxStore: Store;

  constructor(reduxStore: Store) {
    this.store = {};
    this.reduxStore = reduxStore;
    this.list = [];

    for (let key of Object.keys(window.localStorage)) {
      const value = window.localStorage.getItem(key);
      const id = key.substr(5); // "item-${id}"
      if (value) {
        this.store[id] = StoredItem.deserialise(value);
        this.updateItem(id);
        this.list.push(id);
      }
    }
    this.reduxStore.dispatch(createList(this.list));
  }

  createItem(): ItemId {
    const id = idGen.generate();
    this.changeItem({
      id,
      changes: createTemplate
    });
    return id;
  }

  loadItemIfNotPresentWithDispatch(id: ItemId) {
    if (!this.store[id]) {
      this.load(id);
      this.reduxStore.dispatch(addToList(id));
    }
  }

  loadItemIfNotPresent(id: ItemId) {
    if (!this.store[id]) {
      this.load(id);
    }
  }

  load(id: ItemId) {
    const value = window.localStorage.getItem(`item-${id}`);
    if (value) {
      this.store[id] = StoredItem.deserialise(value);
    } else {
      this.store[id] = new StoredItem(id);
    }
    this.list.push(id);
  }

  changeItem(change: ChangeItem): void {
    const { id, changes } = change;
    const modifiedChange: ChangeItem = { id: change.id, changes: [] };

    this.loadItemIfNotPresentWithDispatch(id);
    const storedItem = this.store[id];

    for (let ch of changes) {
      const { field, newValue } = ch;
      storedItem.setField(field, newValue);
      if (storedItem.hasConflict(field)) {
        modifiedChange.changes.push({
          ...ch,
          oldValue: storedItem.getAuxilaryField('their', field)
        });
        storedItem.resolveConflict(field);
      } else {
        modifiedChange.changes.push(ch);
        storedItem.setFieldUpdateness(field, Updateness.Local);
      }
    }
    this.updateItem(id);
    socket.emit('changeItem', modifiedChange);
  }

  changeItemAccepted(change: ChangeItem): void {
    const { id, changes } = change;
    for (let ch of changes) {
      this.store[id].setFieldUpdateness(ch.field, Updateness.JustUpdated);
    }
    this.updateItem(id);
    this.updateItemSoon(id);
  }

  changeItemConflicted(change: ChangeItem): void {
    const { id, changes } = change;
    for (let ch of changes) {
      this.store[id].setConflict(ch.field, ch.newValue, ch.serverValue);
    }
    this.updateItem(id);
  }

  changeItemHappened(change: ChangeItem): void {
    const { id, changes } = change;

    this.loadItemIfNotPresent(id);

    const storedItem = this.store[id];
    for (let ch of changes) {
      const { field, newValue, oldValue } = ch;
      if (storedItem.willConflict(field, oldValue)) {
        storedItem.setConflict(field, storedItem.getField(field), newValue);
      } else {
        this.store[id].setField(field, newValue);
        this.store[id].setFieldUpdateness(field, Updateness.JustUpdated);
      }
    }
    this.updateItem(id);
    this.updateItemSoon(id);
  }

  addRelation(oneSideId: ItemId, relation: RelationType, otherSideId: ItemId) {
    this.store[oneSideId].addRelation(relation, otherSideId);
    this.store[otherSideId].addRelation(oppositeOf(relation), oneSideId);

    this.updateItem(oneSideId);
    this.updateItem(otherSideId);
  }

  updateItemSoon(id: ItemId) {
    const storedItem = this.store[id];
    setTimeout(() => {
      storedItem.updateJustUpdatesToUpToDate();
      this.updateItem(id);
    }, 1500);
  }

  updateItem(id: ItemId) {
    const viewItem = this.getView(id);
    this.reduxStore.dispatch(updateItem(viewItem));
    window.localStorage.setItem(`item-${id}`, this.store[id].serialise());
  }

  getView(id: ItemId): ViewItem {
    const auxilaryColumns = this.store[id].getAuxilaryNames();
    return {
      id,
      fields: this.getViewFields(id, auxilaryColumns),
      auxilaryColumns,
      children: this.store[id].getChildren(),
      updateness: this.store[id].getUpdateness()
    };
  }

  private getViewFields(id: ItemId, auxilaryColumns: string[]) {
    const fields = [];
    for (let field of this.store[id].getFields()) {
      fields.push({
        name: field,
        ...FieldTypeOf(field),
        value: this.store[id].getField(field),
        updateness: this.store[id].getFieldUpdateness(field),
        auxilaryValues: auxilaryColumns.map(name =>
          this.store[id].getAuxilaryField(name, field)
        )
      });
    }
    return fields;
  }

  get(id: ItemId): StoredItem {
    return this.store[id];
  }
}
