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
      const item = { id: tmpId, tmpId, ...action.payload, fieldsChanging: {} };

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
        x => x.id === action.payload.id || x.tmpId === action.payload.tmpId
      );
      if (pos2 === -1) {
        return state;
      } else {
        for (const change of action.payload.changes) {
          (items2[pos2].fieldsChanging as any)[change.field] = change.newValue;
        }

        items2[pos2].changes.push(...action.payload.changes);

        return { itemRepository: { ...state.itemRepository, items: items2 } };
      }

    case 'UPDATED_ITEM':
      const items3 = state.itemRepository.items;
      let pos3 = items3.findIndex(
        x => x.id === action.payload.id || x.tmpId === action.payload.tmpId
      );
      if (pos3 === -1) {
        return state;
      } else {
        let z = items3[pos3].changes;
        for (const change of action.payload.changes) {
          (items3[pos3].fields as any)[change.field] = change.newValue;
          (items3[pos3].fieldsChanging as any)[change.field] = undefined;
          z = z.filter(x => x.field !== change.field);
        }

        items3[pos3].changes = z;

        return { itemRepository: { ...state.itemRepository, items: items3 } };
      }

    default:
      return state;
  }
};
