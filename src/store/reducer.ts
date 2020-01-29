import { AnyAction } from 'redux';
import { AppState } from './state/AppState';
import {
  ItemId,
  StoredItem,
  StoredItemState,
  ItemRepository
} from './state/Item';
import { fieldSchema } from '../FieldSchema';

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
      let item = createEmptyItem();
      const { fields } = action.payload;
      item = addFields(item, fields);
      item = addDefaultFields(item);
      item = addHierarchyFields(item);
      return addItemToRepository(state, item.id, item);

    case 'CREATED_ITEM':
      let itemRepository = state.itemRepository;
      const createdItem = action.payload;
      itemRepository = deleteTempFromRepo(itemRepository, createdItem.tmpId);
      return addItemToRepository(
        { ...state, itemRepository },
        createdItem.id,
        createdItem
      );

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

////////////

function createTempId() {
  return 'tmp:' + Math.random();
}

function createEmptyItem(): StoredItem {
  const tmpId = createTempId();
  return {
    id: tmpId,
    tmpId,
    fields: {},
    fieldsChanging: {},
    state: StoredItemState.Creating,
    changes: []
  };
}

function addFields(item: StoredItem, fields: Record<string, any>): StoredItem {
  item.fields = { ...item.fields, ...fields };
  return item;
}

function addDefaultFields(item: StoredItem): StoredItem {
  for (const field of fieldSchema) {
    if (item.fields[field.name]) continue;

    if (field.defaultValue) {
      item.fields[field.name] = field.defaultValue();
      continue;
    }

    if (field.type === 'enum' && field.values && field.values.length > 0) {
      item.fields[field.name] = field.values[0];
      continue;
    }

    item.fields[field.name] = '';
  }
  return item;
}

function addHierarchyFields(item: StoredItem): StoredItem {
  item.fields.children = [];
  item.fields.parents = [];
  return item;
}

function addItemToRepository(
  state: AppState,
  id: ItemId,
  item: StoredItem
): AppState {
  return {
    ...state,
    itemRepository: {
      ...state.itemRepository,
      allIds: [
        ...state.itemRepository.allIds,
        ...(state.itemRepository.allIds.includes(id) ? [] : [id])
      ],
      byId: { ...state.itemRepository.byId, [id]: item }
    },
    version: state.version + 1
  };
}

/////////////////////////////

function deleteTempFromRepo(
  itemRepo: ItemRepository,
  tmpId: ItemId
): ItemRepository {
  if (itemRepo.byId[tmpId]) {
    delete itemRepo.byId[tmpId];
  }

  const pos = itemRepo.allIds.findIndex(x => x === tmpId);
  if (pos !== -1) {
    itemRepo.allIds.splice(pos, 1);
  }

  return itemRepo;
}

function addToRepo(
  itemRepo: ItemRepository,
  id: ItemId,
  item: StoredItem
): ItemRepository {
  itemRepo.byId[id] = item;

  const pos = itemRepo.allIds.findIndex(x => x === id);
  if (pos === -1) {
    itemRepo.allIds.push(id);
  }

  return itemRepo;
}
