import { Filter } from "../model/Filter";
import { ItemId } from "../model/Item/ItemId";
import { HashtagInfo, ViewItem, ViewItemMeta } from "../model/Item/ViewItem";
import { getField, getTitle } from "./commons";
import { Panel, State } from "./reducer";

export class PanelList {
    static setOrder(state: State, panels: Panel[], id: number, order: {attribute?: string; asc?: boolean }):Panel[] {
        const newPanel:Panel = {
            ...panels[id],
            order: { ...panels[id].order, ...order }
        };

        return {
            ...panels,
            [id]: {
                ...newPanel,
                itemsMeta: filteAndOrderEveryMeta(state.itemList, state.items, newPanel),
                viewedItemList: filterAndOrderRoot(state.itemList, state.items, newPanel),
            }
        }
    };

    static setSearch(state: State, panels: Panel[], id: number, search: string):Panel[] {
        const newPanel:Panel = {
            ...panels[id],
            search
        };

        return {
            ...panels,
            [id]: {
                ...newPanel,
                viewedItemList: filterAndOrderRoot(state.itemList, state.items, newPanel),  
            }
        };
    }

    static setFilters(state: State, panels: Panel[], id: number, filters: Filter[] ):Panel[] {
        const newPanel:Panel = {
            ...panels[id],
            filters
        };

        return {
            ...panels,
            [id]: {
                ...newPanel,
                itemsMeta: filteAndOrderEveryMeta(state.itemList, state.items, newPanel),
                viewedItemList: filterAndOrderRoot(state.itemList, state.items, newPanel),
            }
        };
    }

    static toggleFilter(state: State, panels: Panel[], id: number, filterName: string ):Panel[] {
        const filters = [...panels[id].filters];
        const num = panels[id].filters.findIndex(x => x.id === filterName);
        if (num === -1) return panels;
        filters[num].on = !filters[num].on;

        const newPanel:Panel = {
            ...panels[id],
            filters
        };

        return {
            ...panels,
            [id]: {
                ...newPanel,
                itemsMeta: filteAndOrderEveryMeta(state.itemList, state.items, newPanel),
                viewedItemList: filterAndOrderRoot(state.itemList, state.items, newPanel),
            }
        };
    }

    static toggleHashtagFilter(state: State, panels: Panel[], id: number, hashtagInfo: HashtagInfo ):Panel[] {
        const oldFilters = [...panels[id].filters];
        let filters: Filter[] = [];

        if (oldFilters.some(f => f.id === hashtagInfo.id)) {
        filters = oldFilters.filter(f => f.id !== hashtagInfo.id);
        } else {
        filters = [...oldFilters, {
            id: hashtagInfo.id,
            name: '#' + hashtagInfo.hashtag,
            f: (items: Record<ItemId, ViewItem>) => (x: ItemId) =>
            items[x].hashtags.some(hash => hash.id === hashtagInfo.id),
            on: true,
            hashtag: hashtagInfo
        }];
        }
        
        const newPanel:Panel = {
            ...panels[id],
            filters
        };

        return {
            ...panels,
            [id]: {
                ...newPanel,
                itemsMeta: filteAndOrderEveryMeta(state.itemList, state.items, newPanel),
                viewedItemList: filterAndOrderRoot(state.itemList, state.items, newPanel),
            }
        };
    }

    static updateViewedItemList(state: State, panels: Panel[]):Panel[] {
        return panels.map((panel:Panel) => PanelList.updateViewedItemListOnOnePanel(state, panel));
    }

    static updateViewedItemListOnOnePanel(state: State, panel:Panel):Panel {
        return {
            ...panel,
            // itemsMeta: filteAndOrderEveryMeta(state.itemList, state.items, panel),
            viewedItemList: filterAndOrderRoot(state.itemList, state.items, panel),
        };
    }

    static updateItem(state: State, panels: Panel[], item: ViewItem ):Panel[] {
        return panels.map((panel:Panel) => PanelList.updateItemsOnOnePanel(state, panel, [item]));
    }

    static updateItems(state: State, panels: Panel[], items: ViewItem[] ):Panel[] {
        return panels.map((panel:Panel) => PanelList.updateItemsOnOnePanel(state, panel, items));
    }

    private static updateItemsOnOnePanel(state: State, panel: Panel, items: ViewItem[] ):Panel {
        let itemsMeta = panel.itemsMeta;
        let viewedItemList = panel.viewedItemList;
        
        for(let item of items) {
            itemsMeta = {
                ...itemsMeta,
                [item.id]: {
                    viewedChildren: filterAndOrder(item.children, state.items, panel)
                }
            };
            for (let parent of item.parents) {
                itemsMeta = {
                    ...itemsMeta,
                    [parent]: {
                    viewedChildren: filterAndOrder(
                        itemsMeta[parent] ? itemsMeta[parent].viewedChildren : [],
                        state.items,
                        panel
                    )
                    }
                };
            }
            if (item.parents.length === 0) {
                viewedItemList = filterAndOrderRoot(state.itemList, state.items, panel);
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

const f = (items: RecordOfViewItems, panel: Panel, skipRootRule: boolean) => (x: ItemId) => {
    if (!items[x]) return false;
  
    for (const filter of panel.filters) {
      if (
        filter.on &&
        (!skipRootRule || filter.id !== 'roots') &&
        !filter.f(items)(x)
      ) {
        return false;
      }
    }
    if (panel.search) {
      if (
        !getTitle(x, items)
          .toLocaleLowerCase()
          .includes(panel.search.toLocaleLowerCase())
      ) {
        return false;
      }
    }
    return true;
  };


  
  function filteAndOrderEveryMeta(
    list: ItemId[],
    items: RecordOfViewItems,
    panel: Panel
  ): Record<string, ViewItemMeta> {
    const newMeta: Record<string, ViewItemMeta> = {};
    for (let elem of list) {
      newMeta[elem] = {
        viewedChildren: filterAndOrder(
          panel.itemsMeta[elem].viewedChildren,
          items,
          panel
        )
      };
    }
    return newMeta;
  }

  
  function filterAndOrder(list: ItemId[], items: RecordOfViewItems, panel: Panel): any[] {
    return [...orderx(list.filter(f(items, panel, true)), items, panel)];
  }
  
  function filterAndOrderRoot(list: ItemId[], items: RecordOfViewItems, panel: Panel): any[] {
    return [...orderx(list.filter(f(items, panel, false)), items, panel)];
  }
  
  function orderx(arr: ItemId[], items: RecordOfViewItems, panel: Panel): ItemId[] {
    const field = panel.order.attribute || 'priority';
    const asc = panel.order.asc ? 1 : -1;
  
    arr.sort((a, b) => {
      if (getField(a, field, items) < getField(b, field, items))
        return -asc;
      if (getField(a, field, items) > getField(b, field, items))
        return asc;
      return 0;
    });
    return arr;
  }
  