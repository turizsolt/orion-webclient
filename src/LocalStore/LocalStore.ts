import { Store } from 'redux';
import { ItemId } from '../model/Item/ItemId';
import { StoredItem } from '../model/Item/StoredItem';
import { Change } from '../model/Change/Change';
import { ViewItem } from '../model/Item/ViewItem';
import { updateItem } from '../ReduxStore/actions';

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

        const viewItem = this.getView(id);
        this.reduxStore.dispatch(updateItem(viewItem));
      }
    }
  }

  change(change: Change): void {
    const { id, fieldName, oldValue, newValue } = change;

    console.log('change', id, this.store[id]);
    if (!this.store[id]) {
      const value = window.localStorage.getItem(`item-${id}`);
      if (value) {
        this.store[id] = StoredItem.deserialise(value);
      } else {
        this.store[id] = new StoredItem(id);
      }
    }

    console.log('set', fieldName, newValue);
    this.store[id].setField(fieldName, newValue);

    const viewItem = this.getView(id);
    console.log('vi', viewItem);

    this.reduxStore.dispatch(updateItem(viewItem));
    window.localStorage.setItem(`item-${id}`, this.store[id].serialise());
  }

  getView(id: ItemId): ViewItem {
    const viewItem: ViewItem = {
      id,
      fields: []
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
