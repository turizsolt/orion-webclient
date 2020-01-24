import actionCreatorFactory from 'typescript-fsa';
import { Change } from './state/Change';

const actionCreator = actionCreatorFactory();

export const createItem = actionCreator.async<Change, Change, {}>(
  'CREATE_ITEM'
);
