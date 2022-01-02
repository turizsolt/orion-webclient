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
    order,
    toggleHashtagFilter,
    updateAlive,
    updateChanges,
    updateItems,
    setPanelNames,
    updatesPanels,
    addPanel,
    removePanel,
    toggleInvertedHashtagFilter
} from './actions';
import { ItemId } from '../model/Item/ItemId';
import { ViewItem, ViewItemMeta } from '../model/Item/ViewItem';
import { ChangeId } from '../model/Change/ChangeId';
import { Change } from '../model/Change/Change';
import { Filter } from '../model/Filter';
import { PanelList } from './PanelList';
import { getDefaultPanel, getInitialState } from './reducerInitialState';

export interface Panel {
    viewedItemList: ItemId[];
    itemsMeta: Record<ItemId, ViewItemMeta>;
    options: PanelOptions;
}

export interface PanelOptions {
    filters: Filter[];
    search: string;
    order: { attribute?: string; asc?: boolean };
}

export interface State {
    hover: any;
    draggedId: ItemId | null;
    items: Record<ItemId, ViewItem>;
    itemList: ItemId[];
    changes: Record<ChangeId, Change>;
    changeList: ChangeId[];
    panelList: Panel[];
    panelNames: string[];
    version: number;
    lastAlive: { time: number, message: string }[];
}

const initialState: State = getInitialState();

export const appReducer = (
    state: State = initialState,
    action: AnyAction
): State => {
    if (isType(action, updateAlive)) {
        return {
            ...state,
            lastAlive: [
                {
                    time: action.payload.time || 0,
                    message: action.payload.message || 'pong'
                },
                ...state.lastAlive
            ]
        };
    }

    if (isType(action, setPanelNames)) {
        return {
            ...state,
            panelNames: action.payload,
            version: state.version + 1
        };
    }

    if (isType(action, addPanel)) {
        return {
            ...state,
            panelList: [...state.panelList, getDefaultPanel()],
            version: state.version + 1
        };
    }

    if (isType(action, removePanel)) {
        if (state.panelList.length < 2) return state;

        return {
            ...state,
            panelList: [...state.panelList.filter((val, ind) => ind !== action.payload)],
            version: state.version + 1
        };
    }

    if (isType(action, updatesPanels)) {
        return {
            ...state,
            panelList: PanelList.updatePanels(state, state.panelList, action.payload),
            version: state.version + 1
        };
    }

    if (isType(action, order)) {
        const { panelId, asc, attribute } = action.payload;
        const { panelList } = state;

        return {
            ...state,
            panelList: PanelList.setOrder(state, panelList, panelId, { asc, attribute }),
            version: state.version + 1
        };
    }

    if (isType(action, search)) {
        const { panelId, searchString } = action.payload;
        const { panelList } = state;

        return {
            ...state,
            panelList: PanelList.setSearch(state, panelList, panelId, searchString),
            version: state.version + 1
        };
    }

    if (isType(action, toggleFilter)) {
        const { panelId, filterName } = action.payload;
        const { panelList } = state;

        return {
            ...state,
            panelList: PanelList.toggleFilter(state, panelList, panelId, filterName),
            version: state.version + 1
        };
    }

    if (isType(action, toggleHashtagFilter)) {
        const { panelId, hashtagInfo } = action.payload;
        const { panelList } = state;

        return {
            ...state,
            panelList: PanelList.toggleHashtagFilter(state, panelList, panelId, hashtagInfo),
            version: state.version + 1
        };
    }

    if (isType(action, toggleInvertedHashtagFilter)) {
        const { panelId, hashtagInfo } = action.payload;
        const { panelList } = state;

        return {
            ...state,
            panelList: PanelList.toggleInvertedHashtagFilter(state, panelList, panelId, hashtagInfo),
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
        return {
            ...state,
            items: {
                ...state.items,
                [action.payload.id]: action.payload
            },
            panelList: PanelList.updateItem(state, state.panelList, action.payload),
            version: state.version + 1
        };
    }

    if (isType(action, updateItems)) {
        let items = state.items;

        action.payload.forEach(x => {
            items[x.id] = x;
        });

        return {
            ...state,
            items,
            panelList: PanelList.updateItems(state, state.panelList, action.payload),
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

    if (isType(action, updateChanges)) {
        const changes = state.changes;
        let changeList = state.changeList;

        action.payload.forEach(x => {
            changes[x.changeId] = x;
            changeList = pushIfUnique(state.changeList, x.changeId)
        });

        return {
            ...state,
            changes,
            changeList,
            version: state.version + 1
        };
    }

    if (isType(action, addToItems)) {
        const itemList = pushIfUnique(state.itemList, action.payload);
        return {
            ...state,
            itemList,
            panelList: PanelList.updateViewedItemList(state, state.panelList),
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
            panelList: PanelList.updateViewedItemList(state, state.panelList),
            version: state.version + 1
        };
    }

    if (isType(action, setFilters)) {
        const { panelId, filters } = action.payload;
        const { panelList } = state;

        return {
            ...state,
            panelList: PanelList.setFilters(state, panelList, panelId, filters),
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
