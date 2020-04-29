import { ItemId } from './ItemId';
import { Updateness } from '../Updateness';

export interface ViewItem {
  id: string;
  fields: ViewField[];
  auxilaryColumns: string[];
  children: ItemId[];
  updateness: Updateness;
}

export interface ViewField {
  name: string;
  type: string;
  value: any;
  params?: any;
  updateness: Updateness;
  auxilaryValues: any[];
}
