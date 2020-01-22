export interface Item {
  id: ItemId;
  tmpId: ItemId;
  title: string;
  children: ItemId[];
}

export interface ItemRepository {
  items: StoredItem[];
  changes: ItemChange[];
}

export interface StoredItem {
  id: ItemId;
  tmpId?: ItemId;
  state: StoredItemState;
  changes: ItemChange[];
  fields: any; // is it a record of any, or give more specific type?
  fieldsChanging: any;
}

export interface UpdateItem {
  id: ItemId;
  changes: ItemChange[];
}

export interface ItemChange {
  id: ItemId;
  field: FieldId;
  oldValue: any;
  newValue: any;
}

export enum StoredItemState {
  'Stable' = 0,
  'Creating' = 1,
  'Loading' = 2,
  'Editing' = 10,
  'EditingConflicting' = 11,
  'Changing' = 12,
  'Conflicting' = 13,
  'Deleted' = 20,
  'SwipedOut' = 21
}

export type ItemId = string;
export type FieldId = string;
