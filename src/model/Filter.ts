import { ItemId } from './Item/ItemId';
import { ViewItem } from './Item/ViewItem';

export interface Filter {
  id: string;
  name: string;
  f: (items: Record<ItemId, ViewItem>) => (id: ItemId) => boolean;
  on: boolean;
}
