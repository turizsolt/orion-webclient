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
