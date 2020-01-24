import actionCreatorFactory from 'typescript-fsa';
import { Change } from './state/Change';
import { SelectItem } from './state/AppState';

const actionCreator = actionCreatorFactory();

export const createItem = actionCreator.async<Change, Change, {}>(
  'CREATE_ITEM'
);

export const selectItem = actionCreator<SelectItem>('SELECT_ITEM');
