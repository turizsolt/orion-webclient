import actionCreatorFactory from 'typescript-fsa';
import { ViewItem } from '../../components/Editor/ViewItem';

const actionCreator = actionCreatorFactory();

export const updateItem = actionCreator<ViewItem>('UPDATE_ITEM');
