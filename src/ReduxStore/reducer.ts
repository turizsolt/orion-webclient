import { AnyAction } from 'redux';
import { isType } from 'typescript-fsa';
import { updateItem } from './actions';

const initialState = {
  items: {},
  list: [],
  version: 0
};

type X = any;

export const appReducer = (state: X = initialState, action: AnyAction): X => {
  if (isType(action, updateItem)) {
    return {
      items: {
        ...state.items,
        [action.payload.id]: action.payload
      },
      list: pushIfUnique(state.list, action.payload.id),
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
