import { Relation } from '../Relation/Relation';
import { ItemId } from '../Item/ItemId';
import { FieldName } from '../Item/FieldName';
import { ChangeId } from './ChangeId';
import { RelationType } from '../Relation/RelationType';

export enum ChangeResponse {
  Pending = 'pending',
  Accepted = 'accepted',
  Rejected = 'rejected',
  Happened = 'happened',
  ServerUpdate = 'serverUpdate'
}

export type Change = ItemChange | RelationChange;

export interface ItemChange {
  type: 'ItemChange';
  itemId: ItemId;
  field: FieldName;
  oldValue: any;
  newValue: any;
  changeId: ChangeId;
  response: ChangeResponse;
}

export type RelationChange = {
  type: 'AddRelation' | 'RemoveRelation';
  oneSideId: ItemId;
  relation: RelationType;
  otherSideId: ItemId;
  changeId: ChangeId;
  response: ChangeResponse;
};

/* OBSOLETE below */

export interface ServerGetItem {
  id: string;
  changes: ServerGet[];
  relations: Relation[];
}

export interface ServerGet {
  field: string;
  serverValue: any;
}
