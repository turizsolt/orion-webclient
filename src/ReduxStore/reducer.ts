import { AnyAction } from 'redux';
import { isType } from 'typescript-fsa';
import { updateItem, addToList, createList, setFilters } from './actions';
import { ItemId } from '../model/Item/ItemId';
import { ViewItem } from '../model/Item/ViewItem';

const initialState = {
  items: {},
  list: [],
  filters: [
    {
      id: 'roots',
      name: 'only roots',
      f: (items: Record<ItemId, ViewItem>) => (x: ItemId) =>
        items[x].parents.length === 0,
      on: true
    },
    {
      id: 'not-deleted',
      name: 'only not deleted',
      f: (items: Record<ItemId, ViewItem>) => (x: ItemId) =>
        !items[x].originalFields.deleted ||
        items[x].originalFields.deleted.value !== true,
      on: true
    },
    {
      id: 'not-done',
      name: 'only not done',
      f: (items: Record<ItemId, ViewItem>) => (x: ItemId) =>
        !items[x].originalFields.state ||
        items[x].originalFields.state.value !== 'done',
      on: true
    }
  ],
  version: 0
};

type X = any;

export const appReducer = (state: X = initialState, action: AnyAction): X => {
  if (isType(action, updateItem)) {
    return {
      ...state,
      items: {
        ...state.items,
        [action.payload.id]: action.payload
      },
      version: state.version + 1
    };
  }

  if (isType(action, addToList)) {
    return {
      ...state,
      list: pushIfUnique(state.list, action.payload),
      version: state.version + 1
    };
  }

  if (isType(action, createList)) {
    return {
      ...state,
      list: action.payload,
      version: state.version + 1
    };
  }

  if (isType(action, setFilters)) {
    return {
      ...state,
      filters: action.payload,
      version: state.version + 1
    };
  }

  return state;
};

function pushIfUnique(list: any[], elem: any) {
  if (list.includes(elem)) {
    return list;
  } else {
    return [...list, elem];
  }
}
