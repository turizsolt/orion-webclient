import { Filter, transformFilter } from "../model/Filter";
import { ItemId } from "../model/Item/ItemId";
import { HashtagInfo, ViewItem, ViewItemMeta } from "../model/Item/ViewItem";
import { getField, getTitle } from "./commons";
import { Panel, PanelOptions, PanelWithOptions, State } from "./reducer";

export class PanelList {
    static setOrder(state: State, panels: PanelWithOptions, id: number, order: { attribute?: string; asc?: boolean }): PanelWithOptions {
        if (id === -1) {
            panels.options = {
                ...panels.options,
                order
            }

            panels.list = panels.list.map(oldPanel => ({
                ...oldPanel,
                itemsMeta: filteAndOrderEveryMeta(state.itemList, state.items, panels, oldPanel),
                viewedItemList: filterAndOrderRoot(state.itemList, state.items, panels, oldPanel),
            }));
        } else {
            const newPanel: Panel = {
                ...panels.list[id],
                options: {
                    ...panels.list[id].options,
                    order: { ...panels.list[id].options.order, ...order }
                }
            };

            panels.list[id] = {
                ...newPanel,
                itemsMeta: filteAndOrderEveryMeta(state.itemList, state.items, panels, newPanel),
                viewedItemList: filterAndOrderRoot(state.itemList, state.items, panels, newPanel),
            };
        }

        return panels;
    };

    static setSearch(state: State, panels: PanelWithOptions, id: number, search: string): PanelWithOptions {
        if (id === -1) {
            panels.options = {
                ...panels.options,
                search
            }

            panels.list = panels.list.map(oldPanel => ({
                ...oldPanel,
                itemsMeta: filteAndOrderEveryMeta(state.itemList, state.items, panels, oldPanel),
                viewedItemList: filterAndOrderRoot(state.itemList, state.items, panels, oldPanel),
            }));
        } else {
            const newPanel: Panel = {
                ...panels.list[id],
                options: {
                    ...panels.list[id].options,
                    search
                }
            };

            panels.list[id] = {
                ...newPanel,
                viewedItemList: filterAndOrderRoot(state.itemList, state.items, panels, newPanel),
            };
        }

        return panels;
    }

    static setFilters(state: State, panels: PanelWithOptions, id: number, filters: Filter[]): PanelWithOptions {
        if (id === -1) {
            panels.options = {
                ...panels.options,
                filters
            }

            panels.list = panels.list.map(oldPanel => ({
                ...oldPanel,
                itemsMeta: filteAndOrderEveryMeta(state.itemList, state.items, panels, oldPanel),
                viewedItemList: filterAndOrderRoot(state.itemList, state.items, panels, oldPanel),
            }));
        } else {
            const newPanel: Panel = {
                ...panels.list[id],
                options: {
                    ...panels.list[id].options,
                    filters
                }
            };

            panels.list[id] = {
                ...newPanel,
                itemsMeta: filteAndOrderEveryMeta(state.itemList, state.items, panels, newPanel),
                viewedItemList: filterAndOrderRoot(state.itemList, state.items, panels, newPanel),
            };
        }

        return panels;
    }

    static toggleFilter(state: State, panels: PanelWithOptions, id: number, filterName: string): PanelWithOptions {
        const options = id === -1 ? panels.options : panels.list[id].options;
        const filters = [...options.filters];
        const num = options.filters.findIndex(x => x.id === filterName);
        if (num === -1) return panels;
        filters[num].on = !filters[num].on;

        if (id === -1) {
            panels.options = {
                ...panels.options,
                filters
            }

            panels.list = panels.list.map(oldPanel => ({
                ...oldPanel,
                itemsMeta: filteAndOrderEveryMeta(state.itemList, state.items, panels, oldPanel),
                viewedItemList: filterAndOrderRoot(state.itemList, state.items, panels, oldPanel),
            }));
        } else {
            const newPanel: Panel = {
                ...panels.list[id],
                options: {
                    ...panels.list[id].options,
                    filters
                }
            };

            panels.list[id] = {
                ...newPanel,
                itemsMeta: filteAndOrderEveryMeta(state.itemList, state.items, panels, newPanel),
                viewedItemList: filterAndOrderRoot(state.itemList, state.items, panels, newPanel),
            };
        }

        return panels;
    }

    static toggleHashtagFilter(state: State, panels: PanelWithOptions, id: number, hashtagInfo: HashtagInfo): PanelWithOptions {
        const options = id === -1 ? panels.options : panels.list[id].options;
        const oldFilters = [...options.filters];
        let filters: Filter[] = [];

        if (oldFilters.some(f => f.id === hashtagInfo.id)) {
            filters = oldFilters.filter(f => f.id !== hashtagInfo.id);
        } else {
            filters = [...oldFilters, transformFilter({
                id: hashtagInfo.id,
                name: '#' + hashtagInfo.hashtag,
                f: () => () => false,
                rule: { name: 'hashtag', hashtagInfo },
                on: true,
                hashtag: hashtagInfo
            })];
        }

        if (id === -1) {
            panels.options = {
                ...panels.options,
                filters
            }

            panels.list = panels.list.map(oldPanel => ({
                ...oldPanel,
                itemsMeta: filteAndOrderEveryMeta(state.itemList, state.items, panels, oldPanel),
                viewedItemList: filterAndOrderRoot(state.itemList, state.items, panels, oldPanel),
            }));
        } else {
            const newPanel: Panel = {
                ...panels.list[id],
                options: {
                    ...panels.list[id].options,
                    filters
                }
            };

            panels.list[id] = {
                ...newPanel,
                itemsMeta: filteAndOrderEveryMeta(state.itemList, state.items, panels, newPanel),
                viewedItemList: filterAndOrderRoot(state.itemList, state.items, panels, newPanel),
            };
        }

        return panels;
    }

    static toggleInvertedHashtagFilter(state: State, panels: PanelWithOptions, id: number, hashtagInfo: HashtagInfo): PanelWithOptions {
        const options = id === -1 ? panels.options : panels.list[id].options;
        const oldFilters = [...options.filters];
        let filters: Filter[] = [];

        if (oldFilters.some(f => f.id === hashtagInfo.id)) {
            filters = oldFilters.filter(f => f.id !== hashtagInfo.id);
        } else {
            filters = [...oldFilters, transformFilter({
                id: hashtagInfo.id,
                name: '!' + hashtagInfo.hashtag,
                f: () => () => false,
                rule: { name: 'notHashtag', hashtagInfo },
                on: true,
                hashtag: hashtagInfo
            })];
        }

        if (id === -1) {
            panels.options = {
                ...panels.options,
                filters
            }

            panels.list = panels.list.map(oldPanel => ({
                ...oldPanel,
                itemsMeta: filteAndOrderEveryMeta(state.itemList, state.items, panels, oldPanel),
                viewedItemList: filterAndOrderRoot(state.itemList, state.items, panels, oldPanel),
            }));
        } else {
            const newPanel: Panel = {
                ...panels.list[id],
                options: {
                    ...panels.list[id].options,
                    filters
                }
            };

            panels.list[id] = {
                ...newPanel,
                itemsMeta: filteAndOrderEveryMeta(state.itemList, state.items, panels, newPanel),
                viewedItemList: filterAndOrderRoot(state.itemList, state.items, panels, newPanel),
            };
        }

        return panels;
    }

    static updatePanels(state: State, panels: PanelWithOptions, newPanelOptions: PanelOptions[]): PanelWithOptions {
        panels = {
            options: panels.options,
            list: newPanelOptions.map(npo => ({
                options: npo,
                itemsMeta: {},
                viewedItemList: []
            }))
        };


        return PanelList.updateViewedItemList(state, panels);
    }

    static updateViewedItemList(state: State, panels: PanelWithOptions): PanelWithOptions {
        return { options: panels.options, list: panels.list.map((panel: Panel) => PanelList.updateViewedItemListOnOnePanel(state, panel)) };
    }

    static updateViewedItemListOnOnePanel(state: State, panel: Panel): Panel {
        return {
            ...panel,
            // itemsMeta: filteAndOrderEveryMeta(state.itemList, state.items, state.panel, panel),
            viewedItemList: filterAndOrderRoot(state.itemList, state.items, state.panel, panel),
        };
    }

    static updateItem(state: State, panels: PanelWithOptions, item: ViewItem): PanelWithOptions {
        return { options: panels.options, list: panels.list.map((panel: Panel) => PanelList.updateItemsOnOnePanel(state, panel, [item])) };
    }

    static updateItems(state: State, panels: PanelWithOptions, items: ViewItem[]): PanelWithOptions {
        return { options: panels.options, list: panels.list.map((panel: Panel) => PanelList.updateItemsOnOnePanel(state, panel, items)) };
    }

    private static updateItemsOnOnePanel(state: State, panel: Panel, items: ViewItem[]): Panel {
        let itemsMeta = panel.itemsMeta;
        let viewedItemList = panel.viewedItemList;

        for (let item of items) {
            itemsMeta = {
                ...itemsMeta,
                [item.id]: {
                    viewedChildren: filterAndOrder(item.children, state.items, state.panel, panel)
                }
            };
            for (let parent of item.parents) {
                itemsMeta = {
                    ...itemsMeta,
                    [parent]: {
                        viewedChildren: filterAndOrder(
                            itemsMeta[parent] ? itemsMeta[parent].viewedChildren : [],
                            state.items,
                            state.panel,
                            panel
                        )
                    }
                };
            }
            if (item.parents.length === 0) {
                viewedItemList = filterAndOrderRoot(state.itemList, state.items, state.panel, panel);
            }
        }

        return {
            ...panel,
            viewedItemList,
            itemsMeta
        }
    }
}


// helpers
type RecordOfViewItems = Record<string, ViewItem>;

const f = (items: RecordOfViewItems, panelWithOptions: PanelWithOptions, panel: Panel, skipRootRule: boolean) => (x: ItemId) => {
    if (!items[x]) return false;

    for (const filter of panelWithOptions.options.filters) {
        if (
            filter.on &&
            (!skipRootRule || filter.id !== 'roots') &&
            !filter.f(items)(x)
        ) {
            return false;
        }
    }

    for (const filter of panel.options.filters) {
        if (
            filter.on &&
            (!skipRootRule || filter.id !== 'roots') &&
            !filter.f(items)(x)
        ) {
            return false;
        }
    }

    if (panelWithOptions.options.search) {
        if (
            !getTitle(x, items)
                .toLocaleLowerCase()
                .includes(panelWithOptions.options.search.toLocaleLowerCase())
        ) {
            return false;
        }
    }

    if (panel.options.search) {
        if (
            !getTitle(x, items)
                .toLocaleLowerCase()
                .includes(panel.options.search.toLocaleLowerCase())
        ) {
            return false;
        }
    }
    return true;
};



function filteAndOrderEveryMeta(
    list: ItemId[],
    items: RecordOfViewItems,
    panelWithOptions: PanelWithOptions,
    panel: Panel
): Record<string, ViewItemMeta> {
    const newMeta: Record<string, ViewItemMeta> = {};
    for (let elem of list) {
        newMeta[elem] = {
            viewedChildren: filterAndOrder(
                (panel.itemsMeta[elem] && panel.itemsMeta[elem].viewedChildren) || [],
                items,
                panelWithOptions,
                panel
            )
        };
    }
    return newMeta;
}


function filterAndOrder(list: ItemId[], items: RecordOfViewItems, panelWithOptions: PanelWithOptions, panel: Panel): any[] {
    return [...orderx(list.filter(f(items, panelWithOptions, panel, true)), items, panelWithOptions, panel)];
}

function filterAndOrderRoot(list: ItemId[], items: RecordOfViewItems, panelWithOptions: PanelWithOptions, panel: Panel): any[] {
    return [...orderx(list.filter(f(items, panelWithOptions, panel, false)), items, panelWithOptions, panel)];
}

function orderx(arr: ItemId[], items: RecordOfViewItems, panelWithOptions: PanelWithOptions, panel: Panel): ItemId[] {
    const order = panel.options.order.attribute ?
        panel.options.order :
        panelWithOptions.options.order.attribute ?
            panelWithOptions.options.order :
            undefined;

    if (order) {
        const field = order.attribute || 'priority';
        const asc = order.asc ? 1 : -1;

        arr.sort((a, b) => {
            if (getField(a, field, items) < getField(b, field, items))
                return -asc;
            if (getField(a, field, items) > getField(b, field, items))
                return asc;
            return 0;
        });
    }
    return arr;
}
