
import { ItemId } from '../model/Item/ItemId';
import { ViewItem } from '../model/Item/ViewItem';
import { State } from './reducer';

export function getInitialState(): State {
    return {
        hover: null,
        draggedId: null,
        items: {},
        itemList: [],
        changes: {},
        changeList: [],
        panelList: [{
            viewedItemList: [],
            itemsMeta: {},
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
                id: 'no-generateds',
                name: 'Hide generated items',
                f: (items: Record<ItemId, ViewItem>) => (x: ItemId) =>
                    !items[x].originalFields.generated ||
                    !items[x].originalFields.generated.value,
                on: false
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
        }, {
            viewedItemList: [],
            itemsMeta: {},
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
                id: 'no-generateds',
                name: 'Hide generated items',
                f: (items: Record<ItemId, ViewItem>) => (x: ItemId) =>
                    !items[x].originalFields.generated ||
                    !items[x].originalFields.generated.value,
                on: false
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
        }],
        lastAlive: [],
        version: 0
    }
};
