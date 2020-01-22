import { ItemRepository, ItemId } from './Item';

export interface AppState {
  itemRepository: ItemRepository;
  selectedItem: ItemId | null;
}
