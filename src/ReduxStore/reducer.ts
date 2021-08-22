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
  draggedItem,
  toggleFilter,
  search,
  order
} from './actions';
import { ItemId } from '../model/Item/ItemId';
import { ViewItem, ViewItemMeta } from '../model/Item/ViewItem';
import { getTitle, getField } from './commons';
import { ChangeId } from '../model/Change/ChangeId';
import { Change } from '../model/Change/Change';

export interface Filter {
  id: string;
  name: string;
  f: (items: Record<ItemId, ViewItem>) => (x: ItemId) => boolean;
  on: boolean;
}

export interface State {
  hover: any;
  draggedId: ItemId | null;
  itemsMeta: Record<ItemId, ViewItemMeta>;
  items: Record<ItemId, ViewItem>;
  itemList: ItemId[];
  viewedItemList: ItemId[];
  changes: Record<ChangeId, Change>;
  changeList: ChangeId[];
  filters: Filter[];
  search: string;
  order: { attribute?: string; asc?: boolean };
  version: number;
}

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
      name: 'Hide non-root items',
      f: (items: Record<ItemId, ViewItem>) => (x: ItemId) =>
        items[x].parents.length === 0,
      on: true
    },
    {
      id: 'no-templates',
      name: 'Hide template items',
      f: (items: Record<ItemId, ViewItem>) => (x: ItemId) =>
        !items[x].originalFields.template ||
        !items[x].originalFields.template.value,
      on: true
    },
    {
      id: 'skip-hashtags',
      name: 'Hide hashtags at root',
      f: (items: Record<ItemId, ViewItem>) => (x: ItemId) =>
        !items[x].originalFields.hashtag ||
        !items[x].originalFields.hashtag.value,
      on: true
    },
    {
      id: 'not-deleted',
      name: 'Hide deleted items',
      f: (items: Record<ItemId, ViewItem>) => (x: ItemId) =>
        !items[x].originalFields.deleted ||
        items[x].originalFields.deleted.value !== true,
      on: true
    },
    {
      id: 'not-done',
      name: 'Hide done items',
      f: (items: Record<ItemId, ViewItem>) => (x: ItemId) =>
        !items[x].originalFields.state ||
        items[x].originalFields.state.value !== 'done',
      on: true
    }
  ],
  search: '',
  order: { attribute: 'priority', asc: true },
  version: 0
};

export const appReducer = (
  state: State = initialState,
  action: AnyAction
): State => {
  if (isType(action, order)) {
    return {
      ...state,
      order: { ...state.order, ...action.payload },
      itemsMeta: filteAndOrderEveryMeta(state.itemList, {
        ...state,
        order: { ...state.order, ...action.payload }
      }),
      viewedItemList: filterAndOrderRoot(state.itemList, {
        ...state,
        order: { ...state.order, ...action.payload }
      }),
      version: state.version + 1
    };
  }

  if (isType(action, search)) {
    return {
      ...state,
      search: action.payload,
      viewedItemList: filterAndOrderRoot(state.itemList, {
        ...state,
        search: action.payload
      }),
      version: state.version + 1
    };
  }

  if (isType(action, toggleFilter)) {
    const filters = [...state.filters];
    const num = state.filters.findIndex(x => x.id === action.payload);
    if (num === -1) return state;
    filters[num].on = !filters[num].on;

    return {
      ...state,
      filters,
      itemsMeta: filteAndOrderEveryMeta(state.itemList, { ...state, filters }),
      viewedItemList: filterAndOrderRoot(state.itemList, { ...state, filters }),
      version: state.version + 1
    };
  }

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
  if (state.search) {
    if (
      !getTitle(x, state.items)
        .toLocaleLowerCase()
        .includes(state.search.toLocaleLowerCase())
    ) {
      return false;
    }
  }
  return true;
};

function filteAndOrderEveryMeta(
  list: ItemId[],
  state: State
): Record<string, ViewItemMeta> {
  const newMeta: Record<string, ViewItemMeta> = {};
  for (let elem of list) {
    newMeta[elem] = {
      viewedChildren: filterAndOrder(
        state.itemsMeta[elem].viewedChildren,
        state
      )
    };
  }
  return newMeta;
}

function filterAndOrder(list: any[], state: any): any[] {
  return [...orderx(list.filter(f(state, true)), state)];
}

function filterAndOrderRoot(list: any[], state: any): any[] {
  return [...orderx(list.filter(f(state, false)), state)];
}

function orderx(arr: ItemId[], state: State): ItemId[] {
  const field = state.order.attribute || 'priority';
  const asc = state.order.asc ? 1 : -1;

  arr.sort((a, b) => {
    if (getField(a, field, state.items) < getField(b, field, state.items))
      return -asc;
    if (getField(a, field, state.items) > getField(b, field, state.items))
      return asc;
    return 0;
  });
  return arr;
}
