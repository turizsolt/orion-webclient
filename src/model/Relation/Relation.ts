import { RelationType } from './RelationType';
import { ItemId } from '../Item/ItemId';

export interface Relation {
  type: RelationType;
  otherSideId: ItemId;
}
