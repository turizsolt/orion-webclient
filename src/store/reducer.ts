import { AnyAction } from 'redux';
import { AppState, Repository } from './state/AppState';
import {} from './state/Item';
import { isType } from 'typescript-fsa';
import {
  createItem,
  selectItem,
  updateItem,
  getItem,
  createRelation
} from './actions';
import { Item, ItemId, StoredItem, StoredItemState } from './state/Item';
import {
  StoredChangeState,
  ChangeId,
  CreateItemChangeData,
  StoredChange,
  UpdateItemChangeData,
  CreateRelationChangeData
} from './state/Change';
import { store } from '.';

const initialState: AppState = {
  items: {
    byId: {},
    allIds: []
  },
  changes: {
    byId: {},
    allIds: []
  },
  selectedItemId: null,
  version: 0
};

export const appReducer = (
  state: AppState = initialState,
  action: AnyAction
): AppState => {
  if (isType(action, selectItem)) {
    return {
      ...state,
      selectedItemId: action.payload.id,
      version: state.version + 1
    };
  }

  if (isType(action, getItem.started)) {
    const { id } = action.payload;

    return {
      ...state,
      items: addToRepository(state.items, id, loadingStoredItem(id)),
      version: state.version + 1
    };
  }

  if (isType(action, createItem.started)) {
    const change = action.payload;
    const data = change.data as CreateItemChangeData;
    const changeId = change.id;

    return {
      ...state,
      items: addToRepository(
        state.items,
        data.item.id,
        itemToStoredItem(data.item, changeId)
      ),
      changes: addToRepository(state.changes, changeId, {
        ...change,
        state: StoredChangeState.Pending
      }),
      version: state.version + 1
    };
  }

  if (isType(action, createItem.done)) {
    const change = action.payload.result;
    const data = change.data as CreateItemChangeData;
    const changeId = change.id;

    return {
      ...state,
      items: updateInRepository(
        state.items,
        data.item.id,
        (oldItem: StoredItem): StoredItem => {
          return {
            ...(oldItem ? oldItem : { id: data.item.id }),
            state: StoredItemState.Stable,
            changes: [],
            fieldsLocal: {},
            fieldsCentral: data.item.fields
          };
        }
      ),
      changes: updateInRepository(
        state.changes,
        changeId,
        (oldChange: StoredChange): StoredChange => {
          return {
            ...(oldChange ? oldChange : change),
            state: StoredChangeState.Done
          };
        }
      ),
      version: state.version + 1
    };
  }

  if (isType(action, updateItem.started)) {
    const change = action.payload;
    const data = change.data as UpdateItemChangeData;
    const changeId = change.id;

    return {
      ...state,
      items: updateInRepository(
        state.items,
        data.itemId,
        (oldItem: StoredItem): StoredItem => {
          return {
            ...oldItem,
            state: StoredItemState.Changing,
            changes: [...oldItem.changes, changeId],
            fieldsLocal: {
              ...oldItem.fieldsLocal,
              [data.field]: data.newValue
            },
            fieldsCentral: oldItem.fieldsCentral
          };
        }
      ),
      changes: addToRepository(state.changes, changeId, {
        ...change,
        state: StoredChangeState.Pending
      }),
      version: state.version + 1
    };
  }

  if (isType(action, updateItem.done)) {
    const change = action.payload.result;
    const data = change.data as UpdateItemChangeData;
    const changeId = change.id;

    if (!state.items.byId[data.itemId]) {
      store.dispatch(getItem.started({ id: data.itemId }));
      // todo same as in getItem.started
      return {
        ...state,
        items: addToRepository(
          state.items,
          data.itemId,
          loadingStoredItem(data.itemId)
        ),
        version: state.version + 1
      };
    }

    return {
      ...state,
      items: updateInRepository(
        state.items,
        data.itemId,
        (oldItem: StoredItem): StoredItem => {
          const changes = oldItem.changes.filter(x => x !== changeId);
          const fieldsLocal = {
            ...oldItem.fieldsLocal
          };
          delete fieldsLocal[data.field];

          return {
            ...oldItem,
            state:
              changes.length > 0
                ? StoredItemState.Changing
                : StoredItemState.Stable,
            changes,
            fieldsLocal,
            fieldsCentral: {
              ...oldItem.fieldsCentral,
              [data.field]: data.newValue
            }
          };
        }
      ),
      changes: updateInRepository(
        state.changes,
        changeId,
        (oldChange: StoredChange): StoredChange => {
          return {
            ...(oldChange ? oldChange : change),
            state: StoredChangeState.Done
          };
        }
      ),
      version: state.version + 1
    };
  }

  if (isType(action, createRelation.started)) {
    const change = action.payload;
    const data = change.data as CreateRelationChangeData;
    const changeId = change.id;

    let items = updateInRepository(
      state.items,
      data.parentId,
      (oldItem: StoredItem): StoredItem => {
        return {
          ...oldItem,
          state: StoredItemState.Changing,
          changes: [...oldItem.changes, changeId],
          fieldsLocal: {
            ...oldItem.fieldsLocal,
            children: [...arrify(oldItem.fieldsLocal.children), data.childId]
          }
        };
      }
    );

    items = updateInRepository(
      items,
      data.childId,
      (oldItem: StoredItem): StoredItem => {
        return {
          ...oldItem,
          state: StoredItemState.Changing,
          changes: [...oldItem.changes, changeId],
          fieldsLocal: {
            ...oldItem.fieldsLocal,
            parents: [...arrify(oldItem.fieldsLocal.parents), data.parentId]
          }
        };
      }
    );

    return {
      ...state,
      items,
      changes: addToRepository(state.changes, changeId, {
        ...change,
        state: StoredChangeState.Pending
      }),
      version: state.version + 1
    };
  }

  if (isType(action, createRelation.done)) {
    const change = action.payload.result;
    const data = change.data as CreateRelationChangeData;
    const changeId = change.id;

    let items = updateInRepository(
      state.items,
      data.parentId,
      (oldItem: StoredItem): StoredItem => {
        const changes = oldItem.changes.filter(x => x !== changeId);
        const fieldsLocal = {
          ...oldItem.fieldsLocal,
          children: [
            ...arrify(oldItem.fieldsLocal.children).filter(
              x => x !== data.childId
            )
          ]
        };
        if (fieldsLocal.children.length === 0) {
          delete fieldsLocal.children;
        }

        return {
          ...oldItem,
          state:
            changes.length > 0
              ? StoredItemState.Changing
              : StoredItemState.Stable,
          changes,
          fieldsLocal,
          fieldsCentral: {
            ...oldItem.fieldsCentral,
            children: [...arrify(oldItem.fieldsCentral.children), data.childId]
          }
        };
      }
    );

    items = updateInRepository(
      items,
      data.childId,
      (oldItem: StoredItem): StoredItem => {
        const changes = oldItem.changes.filter(x => x !== changeId);
        const fieldsLocal = {
          ...oldItem.fieldsLocal,
          parents: [
            ...arrify(oldItem.fieldsLocal.parents).filter(
              x => x !== data.parentId
            )
          ]
        };
        if (fieldsLocal.parents.length === 0) {
          delete fieldsLocal.parents;
        }

        return {
          ...oldItem,
          state:
            changes.length > 0
              ? StoredItemState.Changing
              : StoredItemState.Stable,
          changes,
          fieldsLocal,
          fieldsCentral: {
            ...oldItem.fieldsCentral,
            parents: [...arrify(oldItem.fieldsCentral.parents), data.parentId]
          }
        };
      }
    );

    return {
      ...state,
      items,
      changes: addToRepository(state.changes, changeId, {
        ...change,
        state: StoredChangeState.Done
      }),
      version: state.version + 1
    };
  }

  return state;
};

function arrify(arr: any[] | undefined): any[] {
  if (!arr) return [];
  return arr;
}

function itemToStoredItem(item: Item, changeId: ChangeId): StoredItem {
  return {
    id: item.id,
    fieldsCentral: {},
    fieldsLocal: item.fields,
    changes: [changeId],
    state: StoredItemState.Creating
  };
}

function loadingStoredItem(id: ItemId): StoredItem {
  return {
    id,
    fieldsCentral: {},
    fieldsLocal: {},
    changes: [],
    state: StoredItemState.Loading
  };
}

function addToRepository<I extends string, S>(
  repo: Repository<S, I>,
  id: I,
  item: S
): Repository<S, I> {
  return {
    allIds: [...repo.allIds, ...(repo.allIds.includes(id) ? [] : [id])],
    byId: { ...repo.byId, [id]: item }
  };
}

function updateInRepository<I extends string, S>(
  repo: Repository<S, I>,
  id: I,
  update: (oldItem: S) => S
): Repository<S, I> {
  return {
    allIds: [...repo.allIds, ...(repo.allIds.includes(id) ? [] : [id])],
    byId: { ...repo.byId, [id]: update(repo.byId[id]) }
  };
}

/*
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
*/
