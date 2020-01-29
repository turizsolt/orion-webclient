import actionCreatorFactory from 'typescript-fsa';
import { Change } from './state/Change';
import { SelectItem, GetItem } from './state/AppState';

const actionCreator = actionCreatorFactory();

export const createItem = actionCreator.async<Change, Change, {}>(
  'CREATE_ITEM'
);

export const selectItem = actionCreator<SelectItem>('SELECT_ITEM');

export const updateItem = actionCreator.async<Change, Change, {}>(
  'UPDATE_ITEM'
);

export const getItem = actionCreator.async<GetItem, Change, {}>('GET_ITEM');

export const getAllItem = actionCreator.async<{}, {}, {}>('GET_ALL_ITEM');

export const createRelation = actionCreator.async<Change, Change, {}>(
  'CREATE_RELATION'
);
