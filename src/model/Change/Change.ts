import { Relation } from '../Relation/Relation';
import { ItemId } from '../Item/ItemId';
import { FieldName } from '../Item/FieldName';
import { ChangeId } from './ChangeId';

export interface Change {
  itemId: ItemId;
  field: FieldName;
  oldValue: any;
  newValue: any;
}

/* OBSOLETE below */

export interface ChangeItem {
  id: string;
  changes: OldChange[];
}

export interface OldChange {
  field: string;
  oldValue: any;
  newValue: any;
  serverValue?: any;
  changeId: ChangeId;
}

export interface ServerGetItem {
  id: string;
  changes: ServerGet[];
  relations: Relation[];
}

export interface ServerGet {
  field: string;
  serverValue: any;
}
