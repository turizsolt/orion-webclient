import { ItemRepository, ItemId } from './Item';

export interface AppState {
  itemRepository: ItemRepository;
  selectedId: ItemId | null;
  version: number;
}
