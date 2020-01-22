import { AnyAction } from 'redux';
import { AppState } from './state/AppState';

const initialState: AppState = {
  itemRepository: {
    items: [],
    changes: []
  }
};

export const appReducer = (
  state: AppState = initialState,
  action: AnyAction
): AppState => {
  switch (action.type) {
    case 'CREATE_ITEM':
      const tmpId = 'tmp:' + Math.random();
      const item = { id: tmpId, tmpId, ...action.payload };

      return {
        itemRepository: {
          ...state.itemRepository,
          items: [...state.itemRepository.items, item]
        }
      };

    case 'CREATED_ITEM':
      const items = state.itemRepository.items;
      let pos = items.findIndex(
        x => x.id === action.payload.id || x.tmpId === action.payload.tmpId
      );
      if (pos === -1) {
        items.push(action.payload);
      } else {
        items[pos] = action.payload;
      }

      return { itemRepository: { ...state.itemRepository, items } };

    case 'UPDATE_ITEM':
      const items2 = state.itemRepository.items;
      let pos2 = items2.findIndex(
        x => x.id === action.payload.id || x.tmpId === action.payload.id
      );
      if (pos2 === -1) {
        return state;
      } else {
        for (const change of action.payload.changes) {
          (items2[pos2] as any)[change.field] = change.newValue;
        }

        return { itemRepository: { ...state.itemRepository, items: items2 } };
      }

    default:
      return state;
  }
};
