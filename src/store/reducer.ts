import { AnyAction } from 'redux';
import { AppState } from './state/AppState';

const initialState: AppState = {
  items: [{ id: 'qwertyu', title: 'almafa', children: [] }]
};

export const appReducer = (
  state: AppState = initialState,
  action: AnyAction
): AppState => {
  switch (action.type) {
    case 'CREATE_ITEM':
      return {
        items: [...state.items, action.payload]
      };

    case 'CREATED_ITEM':
      return {
        items: [...state.items, action.payload]
      };

    default:
      return state;
  }
};
