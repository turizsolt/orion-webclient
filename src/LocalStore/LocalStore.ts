import { Store } from 'redux';
import { ItemId } from '../model/Item/ItemId';
import { StoredItem } from '../model/Item/StoredItem';
import { Change } from '../model/Change/Change';
import { ViewItem } from '../model/Item/ViewItem';
import { updateItem, createList, addToList } from '../ReduxStore/actions';
import { RelationType, oppositeOf } from '../model/Relation/RelationType';
import { FieldTypeOf } from '../model/Item/FieldTypeOf';
import { ActualIdGenerator } from '../idGenerator/ActualIdGenerator';

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
      fieldName: 'title',
      oldValue: undefined,
      newValue: 'rndstr'
    });
    this.changeItem({
      id: id,
      fieldName: 'description',
      oldValue: undefined,
      newValue: 'arghhhh'
    });
    this.changeItem({
      id: id,
      fieldName: 'isIt',
      oldValue: undefined,
      newValue: true
    });
    this.changeItem({
      id: id,
      fieldName: 'state',
      oldValue: undefined,
      newValue: 'todo'
    });
    this.changeItem({
      id: id,
      fieldName: 'count',
      oldValue: undefined,
      newValue: '3'
    });
    return id;
  }

  changeItem(change: Change): void {
    const { id, fieldName, newValue } = change;

    if (!this.store[id]) {
      const value = window.localStorage.getItem(`item-${id}`);
      if (value) {
        this.store[id] = StoredItem.deserialise(value);
      } else {
        this.store[id] = new StoredItem(id);
      }
      this.list.push(id);
      this.reduxStore.dispatch(addToList(id));
    }

    this.store[id].setField(fieldName, newValue);
    this.updateItem(id);
  }

  addRelation(oneSideId: ItemId, relation: RelationType, otherSideId: ItemId) {
    this.store[oneSideId].addRelation(relation, otherSideId);
    this.store[otherSideId].addRelation(oppositeOf(relation), oneSideId);

    this.updateItem(oneSideId);
    this.updateItem(otherSideId);
  }

  updateItem(id: ItemId) {
    const viewItem = this.getView(id);
    this.reduxStore.dispatch(updateItem(viewItem));
    window.localStorage.setItem(`item-${id}`, this.store[id].serialise());
  }

  getView(id: ItemId): ViewItem {
    const viewItem: ViewItem = {
      id,
      fields: [],
      children: this.store[id].getChildren()
    };
    for (let field of this.store[id].getFields()) {
      viewItem.fields.push({
        name: field,
        ...FieldTypeOf(field),
        value: this.store[id].getField(field)
      });
    }
    return viewItem;
  }

  get(id: ItemId): StoredItem {
    return this.store[id];
  }
}
