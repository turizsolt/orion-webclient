import { Store } from 'redux';
import { ItemId } from '../model/Item/ItemId';
import { StoredItem } from '../model/Item/StoredItem';
import { Change } from '../model/Change/Change';
import { ViewItem } from '../model/Item/ViewItem';
import { updateItem } from '../ReduxStore/actions';
import { RelationType, oppositeOf } from '../model/Relation/RelationType';

export class LocalStore {
  private store: Record<ItemId, StoredItem>;
  private reduxStore: Store;

  constructor(reduxStore: Store) {
    this.store = {};
    this.reduxStore = reduxStore;

    for (let key of Object.keys(window.localStorage)) {
      const value = window.localStorage.getItem(key);
      const id = key.substr(5); // "item-${id}"
      if (value) {
        this.store[id] = StoredItem.deserialise(value);
        this.updateItem(id);
      }
    }
  }

  changeItem(change: Change): void {
    const { id, fieldName, oldValue, newValue } = change;

    if (!this.store[id]) {
      const value = window.localStorage.getItem(`item-${id}`);
      if (value) {
        this.store[id] = StoredItem.deserialise(value);
      } else {
        this.store[id] = new StoredItem(id);
      }
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
        type: 'Text',
        value: this.store[id].getField(field)
      });
    }
    return viewItem;
  }

  get(id: ItemId): StoredItem {
    return this.store[id];
  }
}
