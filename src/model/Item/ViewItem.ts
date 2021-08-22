import { ItemId } from './ItemId';
import { Updateness } from '../Updateness';

export interface ViewItem {
  id: string;
  fields: ViewField[];
  originalFields: Record<string, any>;
  auxilaryColumns: string[];
  children: ItemId[];
  hashtags: HashtagInfo[];
  responsibles: ResponsibleInfo[];
  templates: TemplateInfo[];
  generateds: GeneratedInfo[];
  parents: ItemId[];
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

export interface ViewItemMeta {
  viewedChildren: ItemId[];
}

export interface HashtagInfo {
  color: string;
  hashtag: string;
  id: ItemId;
}

export interface ResponsibleInfo {
  username: string;
  id: ItemId;
}

export interface TemplateInfo {
  title: string;
  id: ItemId;
}

export interface GeneratedInfo {
  id: ItemId;
}
