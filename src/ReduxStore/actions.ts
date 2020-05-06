import actionCreatorFactory from 'typescript-fsa';
import { ViewItem } from '../model/Item/ViewItem';
import { ItemId } from '../model/Item/ItemId';
import { Filter } from '../model/Filter';

const actionCreator = actionCreatorFactory();

export const updateItem = actionCreator<ViewItem>('UPDATE_ITEM');
export const addToList = actionCreator<ItemId>('ADD_TO_LIST');
export const createList = actionCreator<ItemId[]>('CREATE_LIST');
export const setFilters = actionCreator<Filter[]>('SET_FILTERS');
