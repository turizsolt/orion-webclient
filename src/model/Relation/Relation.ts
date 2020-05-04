import { RelationType } from './RelationType';
import { ItemId } from '../Item/ItemId';
import { Updateness } from '../Updateness';

export interface Relation {
  type: RelationType;
  otherSideId: ItemId;
  updateness: Updateness;
}
