import { Item } from './Item';

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
  | 'CreateRelation'
  | 'RemoveRelation';

export interface ChangeData {}

export interface CreateItemChangeData extends ChangeData {
  item: Item;
}

/*
export interface UpdateItemChange extends Change {
  type: 'UpdateItem';
  itemId: ItemId;
  field: string;
  oldValue: any;
  newValue: any;
}

export interface CreateRelationChange extends Change {
  type: 'CreateRelation';
  parentId: ItemId;
  childId: ItemId;
}

export interface RemoveRelationChange extends Change {
  type: 'RemoveRelation';
  parentId: ItemId;
  childId: ItemId;
}
*/
