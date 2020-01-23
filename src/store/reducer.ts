import { AnyAction } from 'redux';
import { AppState } from './state/AppState';
import { ItemId } from './state/Item';

const initialState: AppState = {
  itemRepository: {
    byId: {},
    allIds: [],
    changes: []
  },
  selectedId: null,
  version: 0
};

export const appReducer = (
  state: AppState = initialState,
  action: AnyAction
): AppState => {
  switch (action.type) {
    case 'SELECT_ITEM':
      return {
        ...state,
        selectedId: action.payload.id,
        version: state.version + 1
      };

    case 'CREATE_ITEM':
      const tmpId = 'tmp:' + Math.random();
      const item = { id: tmpId, tmpId, ...action.payload, fieldsChanging: {} };

      return {
        ...state,
        itemRepository: {
          ...state.itemRepository,
          allIds: [...state.itemRepository.allIds, item.tmpId],
          byId: { ...state.itemRepository.byId, [item.tmpId]: item }
        },
        version: state.version + 1
      };

    case 'CREATED_ITEM':
      const itemRepo = state.itemRepository;
      const createdItem = action.payload;

      if (itemRepo.byId[createdItem.tmpId]) {
        delete itemRepo.byId[createdItem.tmpId];
      }

      itemRepo.byId[createdItem.id] = createdItem;

      let pos = itemRepo.allIds.findIndex(x => x === createdItem.tmpId);
      if (pos !== -1) {
        itemRepo.allIds.splice(pos, 1);
      }

      pos = itemRepo.allIds.findIndex(x => x === createdItem.id);
      if (pos === -1) {
        itemRepo.allIds.push(createdItem.id);
      }

      return { ...state, itemRepository: itemRepo, version: state.version + 1 };

    case 'UPDATE_ITEM':
      const itemRepo2 = state.itemRepository;
      const updateItem = action.payload;

      const u = (id: ItemId) => {
        for (const change of action.payload.changes) {
          itemRepo2.byId[id].fieldsChanging[change.field] = change.newValue;
        }
        itemRepo2.byId[id].changes.push(...action.payload.changes);
      };

      if (itemRepo2.byId[updateItem.id]) {
        u(updateItem.id);
      } else if (itemRepo2.byId[updateItem.tmpId]) {
        u(updateItem.tmpId);
      }

      return {
        ...state,
        itemRepository: itemRepo2,
        version: state.version + 1
      };

    case 'UPDATED_ITEM':
      const itemRepo3 = state.itemRepository;
      const updatedItem = action.payload;

      const v = (id: ItemId) => {
        let z = itemRepo3.byId[id].changes;
        for (const change of action.payload.changes) {
          itemRepo3.byId[id].fields[change.field] = change.newValue;
          itemRepo3.byId[id].fieldsChanging[change.field] = undefined;
          z = z.filter(x => x.field !== change.field);
        }
        itemRepo3.byId[id].changes = z;
      };

      if (itemRepo3.byId[updatedItem.id]) {
        v(updatedItem.id);
      } else if (itemRepo3.byId[updatedItem.tmpId]) {
        v(updatedItem.tmpId);
      }

      return {
        ...state,
        itemRepository: itemRepo3,
        version: state.version + 1
      };

    default:
      return state;
  }
};
