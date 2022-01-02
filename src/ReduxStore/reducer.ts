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
    disableAdding?: boolean;
    filters: Filter[];
    search: string;
    order: { attribute?: string; asc?: boolean };
}

export interface PanelWithOptions {
    options: PanelOptions;
    list: Panel[];
}

export interface State {
    hover: any;
    draggedId: ItemId | null;
    items: Record<ItemId, ViewItem>;
    itemList: ItemId[];
    changes: Record<ChangeId, Change>;
    changeList: ChangeId[];
    panel: PanelWithOptions;
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
            panel: {
                options: state.panel.options,
                list: [...state.panel.list, getDefaultPanel()],
            },
            version: state.version + 1
        };
    }

    if (isType(action, removePanel)) {
        if (state.panel.list.length < 2) return state;

        return {
            ...state,
            panel: {
                options: state.panel.options,
                list: [...state.panel.list.filter((val, ind) => ind !== action.payload)],
            },
            version: state.version + 1
        };
    }

    if (isType(action, updatesPanels)) {
        return {
            ...state,
            panel: PanelList.updatePanels(state, state.panel, action.payload),
            version: state.version + 1
        };
    }

    if (isType(action, order)) {
        const { panelId, asc, attribute } = action.payload;
        const { panel } = state;

        return {
            ...state,
            panel: PanelList.setOrder(state, panel, panelId, { asc, attribute }),
            version: state.version + 1
        };
    }

    if (isType(action, search)) {
        const { panelId, searchString } = action.payload;
        const { panel } = state;

        return {
            ...state,
            panel: PanelList.setSearch(state, panel, panelId, searchString),
            version: state.version + 1
        };
    }

    if (isType(action, toggleFilter)) {
        const { panelId, filterName } = action.payload;
        const { panel } = state;

        return {
            ...state,
            panel: PanelList.toggleFilter(state, panel, panelId, filterName),
            version: state.version + 1
        };
    }

    if (isType(action, toggleHashtagFilter)) {
        const { panelId, hashtagInfo } = action.payload;
        const { panel } = state;

        return {
            ...state,
            panel: PanelList.toggleHashtagFilter(state, panel, panelId, hashtagInfo),
            version: state.version + 1
        };
    }

    if (isType(action, toggleInvertedHashtagFilter)) {
        const { panelId, hashtagInfo } = action.payload;
        const { panel } = state;

        return {
            ...state,
            panel: PanelList.toggleInvertedHashtagFilter(state, panel, panelId, hashtagInfo),
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
            panel: PanelList.updateItem(state, state.panel, action.payload),
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
            panel: PanelList.updateItems(state, state.panel, action.payload),
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
            panel: PanelList.updateViewedItemList(state, state.panel),
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
            panel: PanelList.updateViewedItemList(state, state.panel),
            version: state.version + 1
        };
    }

    if (isType(action, setFilters)) {
        const { panelId, filters } = action.payload;
        const { panel } = state;

        return {
            ...state,
            panel: PanelList.setFilters(state, panel, panelId, filters),
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
