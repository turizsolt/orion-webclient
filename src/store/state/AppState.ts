import { ChangeId, StoredChange } from './Change';
import { StoredItem, ItemId } from './Item';

export interface Repository<T, I extends string> {
  byId: Record<I, T>;
  allIds: I[];
}

export type ItemRepository = Repository<StoredItem, ItemId>;
export type ChangeRepository = Repository<StoredChange, ChangeId>;
export type SelectedItemId = ItemId | null;

export interface AppState {
  items: ItemRepository;
  changes: ChangeRepository;
  selectedItem: {
    selectedId: SelectedItemId;
    focusedId: SelectedItemId;
  };
  version: number;
}

export interface SelectItem {
  id: SelectedItemId;
}

export interface GetItem {
  id: ItemId;
}
