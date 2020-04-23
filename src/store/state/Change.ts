import { Item, ItemId } from './Item';

export interface Change {
  id: ChangeId;
  type: ChangeType;
  data: ChangeData;
}

export interface StoredChange extends Change {
  state: StoredChangeState;
}

export enum StoredChangeState {
  Pending = 'Pending',
  Failed = 'Failed',
  Done = 'Done'
}

export type ChangeId = string;
export type ChangeType =
  | 'CreateItem'
  | 'UpdateItem'
  | 'UpdateChildOrder'
  | 'CreateRelation'
  | 'RemoveRelation';

export interface ChangeData {}

export interface CreateItemChangeData extends ChangeData {
  item: Item;
}

export interface UpdateItemChangeData extends ChangeData {
  itemId: ItemId;
  field: string;
  oldValue: any;
  newValue: any;
}

export interface CreateRelationChangeData extends ChangeData {
  parentId: ItemId;
  childId: ItemId;
}
