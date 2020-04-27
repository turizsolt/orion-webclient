import { ItemId } from './ItemId';

export interface ViewItem {
  id: string;
  fields: ViewField[];
  children: ItemId[];
}

export interface ViewField {
  name: string;
  type: string;
  value: any;
  params?: any;
}
