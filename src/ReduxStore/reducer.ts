import { AnyAction } from 'redux';
import { isType } from 'typescript-fsa';
import {
  updateItem,
  addToItems,
  createItemList,
  setFilters,
  updateChange,
  addToChanges,
  hoverItem,
  draggedItem
} from './actions';
import { ItemId } from '../model/Item/ItemId';
import { ViewItem } from '../model/Item/ViewItem';
import { getPriority } from './commons';

const initialState = {
  hover: null,
  draggedId: null,
  itemsMeta: {},
  items: {},
  itemList: [],
  viewedItemList: [],
  changes: {},
  changeList: [],
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
  if (isType(action, hoverItem)) {
    return {
      ...state,
      hover: action.payload
    };
  }

  if (isType(action, draggedItem)) {
    return {
      ...state,
      draggedId: action.payload
    };
  }

  if (isType(action, updateItem)) {
    let itemsMeta = state.itemsMeta;
    let viewedItemList = state.viewedItemList;
    itemsMeta = {
      ...itemsMeta,
      [action.payload.id]: {
        viewedChildren: filterAndOrder(action.payload.children, state)
      }
    };
    for (let parent of action.payload.parents) {
      itemsMeta = {
        ...itemsMeta,
        [parent]: {
          viewedChildren: filterAndOrder(
            itemsMeta[parent] ? itemsMeta[parent].viewedChildren : [],
            state
          )
        }
      };
    }
    if (action.payload.parents.length === 0) {
      viewedItemList = filterAndOrderRoot(state.itemList, state);
    }

    return {
      ...state,
      items: {
        ...state.items,
        [action.payload.id]: action.payload
      },
      itemsMeta,
      viewedItemList,
      version: state.version + 1
    };
  }

  if (isType(action, updateChange)) {
    return {
      ...state,
      changes: {
        ...state.changes,
        [action.payload.changeId]: action.payload
      },
      changeList: pushIfUnique(state.changeList, action.payload.changeId),
      version: state.version + 1
    };
  }

  if (isType(action, addToItems)) {
    const itemList = pushIfUnique(state.itemList, action.payload);
    return {
      ...state,
      itemList,
      viewedItemList: filterAndOrderRoot(itemList, state),
      version: state.version + 1
    };
  }

  if (isType(action, addToChanges)) {
    return {
      ...state,
      changeList: pushIfUnique(state.changeList, action.payload),
      version: state.version + 1
    };
  }

  if (isType(action, createItemList)) {
    return {
      ...state,
      itemList: action.payload,
      viewedItemList: filterAndOrderRoot(action.payload, state),
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

const f = (state: any, skipRootRule: boolean) => (x: ItemId) => {
  if (!state.items[x]) return false;

  for (const filter of state.filters) {
    if (
      filter.on &&
      (!skipRootRule || filter.id !== 'roots') &&
      !filter.f(state.items)(x)
    ) {
      return false;
    }
  }
  return true;
};

function filterAndOrder(list: any[], state: any): any[] {
  return [...order(list.filter(f(state, true)), state)];
}

function filterAndOrderRoot(list: any[], state: any): any[] {
  return [...order(list.filter(f(state, false)), state)];
}

function order(arr: ItemId[], state: any): ItemId[] {
  arr.sort((a, b) => {
    if (getPriority(a, state.items) < getPriority(b, state.items)) return -1;
    if (getPriority(a, state.items) > getPriority(b, state.items)) return 1;
    return 0;
  });
  return arr;
}
