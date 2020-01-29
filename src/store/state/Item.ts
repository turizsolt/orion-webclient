import { ChangeId } from './Change';

export type ItemId = string;
export type FieldId = string;
export type ItemFields = Record<FieldId, any>;

export interface Item {
  id: ItemId;
  fields: ItemFields;
}

export interface StoredItem {
  id: ItemId;
  state: StoredItemState;
  changes: ChangeId[];
  fieldsLocal: ItemFields;
  fieldsCentral: ItemFields;
}

export enum StoredItemState {
  Stable = 'Stable',
  Creating = 'Creating',
  Loading = 'Loading',
  Editing = 'Editing',
  EditingConflicting = 'EditingConflicting',
  Changing = 'Changing',
  Conflicting = 'Conflicting',
  Deleted = 'Deleted',
  SwipedOut = 'SwipedOut'
}
