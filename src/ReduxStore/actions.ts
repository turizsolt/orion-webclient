import actionCreatorFactory from 'typescript-fsa';
import { ViewItem } from '../model/Item/ViewItem';

const actionCreator = actionCreatorFactory();

export const updateItem = actionCreator<ViewItem>('UPDATE_ITEM');
