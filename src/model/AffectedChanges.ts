import { Change } from './Change/Change';
import { ChangeId } from './Change/ChangeId';
import { ItemId } from './Item/ItemId';

export interface AffectedChanges {
  changes: Change[];
  affectedChanges: ChangeId[];
  affectedItems: ItemId[];
}
