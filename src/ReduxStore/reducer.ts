import { AnyAction } from 'redux';
import { isType } from 'typescript-fsa';
import { updateItem, addToList, createList } from './actions';

const initialState = {
  items: {},
  list: [],
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

  return state;
};

function pushIfUnique(list: any[], elem: any) {
  if (list.includes(elem)) {
    return list;
  } else {
    return [...list, elem];
  }
}
