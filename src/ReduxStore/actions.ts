import actionCreatorFactory from 'typescript-fsa';
import { ViewItem } from '../model/Item/ViewItem';
import { ItemId } from '../model/Item/ItemId';
import { Filter } from '../model/Filter';
import { ViewChange } from '../model/Change/ViewChange';

const actionCreator = actionCreatorFactory();

export const updateItem = actionCreator<ViewItem>('UPDATE_ITEM');
export const updateChange = actionCreator<ViewChange>('UPDATE_CHANGE');
export const addToItems = actionCreator<ItemId>('ADD_TO_ITEMS');
export const addToChanges = actionCreator<ItemId>('ADD_TO_CHANGES');
export const createItemList = actionCreator<ItemId[]>('CREATE_ITEM_LIST');
export const setFilters = actionCreator<Filter[]>('SET_FILTERS');
export const hoverItem = actionCreator<{
  path: string;
  place: string;
  id: ItemId;
  parentId: ItemId | null;
} | null>('HOVER_ITEM');
export const draggedItem = actionCreator<ItemId | null>('DRAGGED_ITEM');
export const toggleFilter = actionCreator<string>('TOGGLE_FILTER');
export const search = actionCreator<string>('SEARCH');
export const order = actionCreator<{ attribute?: string; asc?: boolean }>(
  'ORDER'
);
