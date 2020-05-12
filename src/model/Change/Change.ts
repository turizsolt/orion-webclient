import { Relation } from '../Relation/Relation';
import { ItemId } from '../Item/ItemId';
import { FieldName } from '../Item/FieldName';
import { ChangeId } from './ChangeId';
import { RelationType } from '../Relation/RelationType';

export type Change = ItemChange | RelationChange;

export interface ItemChange {
  type: 'ItemChange';
  itemId: ItemId;
  field: FieldName;
  oldValue: any;
  newValue: any;
}

export type RelationChange = {
  type: 'AddRelation' | 'RemoveRelation';
  oneSideId: ItemId;
  relation: RelationType;
  otherSideId: ItemId;
  changeId: ChangeId;
};

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
