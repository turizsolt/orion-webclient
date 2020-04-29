import { ItemId } from './ItemId';
import { Updateness } from '../Updateness';

export interface ViewItem {
  id: string;
  fields: ViewField[];
  children: ItemId[];
  updateness: Updateness;
}

export interface ViewField {
  name: string;
  type: string;
  value: any;
  params?: any;
  updateness: Updateness;
}
