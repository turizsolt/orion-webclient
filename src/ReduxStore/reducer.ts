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

const initialState = {
  hover: null,
  draggedId: null,
  itemsMeta: {},
  items: {},
  itemList: [],
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
    let itemList = state.itemList;
    itemsMeta = {
      ...itemsMeta,
      [action.payload.id]: {
        viewedChildren: filterAndOrder(action.payload.children)
      }
    };
    for (let parent of action.payload.parents) {
      itemsMeta = {
        ...itemsMeta,
        [parent]: {
          viewedChildren: filterAndOrder(
            itemsMeta[parent] ? itemsMeta[parent].viewedChildren : []
          )
        }
      };
    }
    if (action.payload.parents.length === 0) {
      itemList = filterAndOrder(itemList);
    }

    return {
      ...state,
      items: {
        ...state.items,
        [action.payload.id]: action.payload
      },
      itemList,
      itemsMeta,
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
    return {
      ...state,
      itemList: pushIfUnique(state.itemList, action.payload),
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

function filterAndOrder(list: any[]): any[] {
  return [...list];
}

/*

const f = (x: ItemId) => {
  return true;
  //  !items[x].originalFields.deleted ||
  //  items[x].originalFields.deleted.value !== true
  //);
};

const x = (c: string) => {
  if (!items[c]) {
    return 0;
  }
  if (!items[c].originalFields) {
    return 0;
  }
  if (!items[c].originalFields.priority) {
    return 0;
  }
  if (!items[c].originalFields.priority.value) {
    return 0;
  }
  return parseInt(items[c].originalFields.priority.value, 10);
};

const order = (arr: ItemId[]): ItemId[] => {
  arr.sort((a, b) => {
    if (x(a) < x(b)) return 1;
    if (x(a) > x(b)) return -1;
    return 0;
  });
  return arr;
};

const x = (c: string) => {
    if (
      !items[c] ||
      !items[c].originalFields ||
      !items[c].originalFields.priority ||
      !items[c].originalFields.priority.value
    ) {
      return 0;
    }
    return parseInt(items[c].originalFields.priority.value, 10);
  };

  const order = (arr: ItemId[]): ItemId[] => {
    arr.sort((a, b) => {
      if (x(a) < x(b)) return 1;
      if (x(a) > x(b)) return -1;
      return 0;
    });
    return arr;
  };

  const f = (x: ItemId) => {
    if (!items[x]) return false;

    for (const filter of filters) {
      if (filter.on && !filter.f(items)(x)) {
        return false;
      }
    }
    return true;
  };
  */
