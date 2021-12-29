import actionCreatorFactory from 'typescript-fsa';
import { HashtagInfo, ViewItem } from '../model/Item/ViewItem';
import { ItemId } from '../model/Item/ItemId';
import { Filter } from '../model/Filter';
import { ViewChange } from '../model/Change/ViewChange';

const actionCreator = actionCreatorFactory();

export const updateItem = actionCreator<ViewItem>('UPDATE_ITEM');
export const updateItems = actionCreator<ViewItem[]>('UPDATE_ITEMS');
export const updateChange = actionCreator<ViewChange>('UPDATE_CHANGE');
export const updateChanges = actionCreator<ViewChange[]>('UPDATE_CHANGES');
export const addToItems = actionCreator<ItemId>('ADD_TO_ITEMS');
export const addToChanges = actionCreator<ItemId>('ADD_TO_CHANGES');
export const createItemList = actionCreator<ItemId[]>('CREATE_ITEM_LIST');
export const hoverItem = actionCreator<{
  path: string;
  place: string;
  id: ItemId;
  parentId: ItemId | null;
} | null>('HOVER_ITEM');
export const draggedItem = actionCreator<ItemId | null>('DRAGGED_ITEM');

export const setFilters = actionCreator<{panelId: number, filters: Filter[]}>('SET_FILTERS');
export const toggleFilter = actionCreator<{panelId: number, filterName: string}>('TOGGLE_FILTER');
export const search = actionCreator<{panelId: number, searchString: string}>('SEARCH');
export const order = actionCreator<{panelId: number, attribute?: string; asc?: boolean }>(
  'ORDER'
);
export const toggleHashtagFilter = actionCreator<{panelId: number, hashtagInfo: HashtagInfo}>(
  'TOGGLE_HASHTAG_FILTER'
);

export const updateAlive = actionCreator<{time?: number, message?: string}>(
  'UPDATE_ALIVE'
);    
