import { Change } from './Change';
import { ItemId } from './ItemId';
import { StoredItem } from './StoredItem';
import { Store } from 'redux';
import { updateItem } from './state/actions';
import { ViewItem } from '../components/Editor/ViewItem';

export class LocalStore {
  private store: Record<ItemId, StoredItem>;
  private reduxStore: Store;

  constructor(reduxStore: Store) {
    this.store = {};
    this.reduxStore = reduxStore;
  }

  change(change: Change): void {
    const { id, fieldName, oldValue, newValue } = change;

    console.log('change', id, this.store[id]);
    if (!this.store[id]) {
      this.store[id] = new StoredItem(id);
    }

    console.log('set', fieldName, newValue);
    this.store[id].setField(fieldName, newValue);

    const viewItem = this.getView(id);
    console.log('vi', viewItem);
    this.reduxStore.dispatch(updateItem(viewItem));
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
