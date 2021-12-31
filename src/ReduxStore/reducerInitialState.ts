
import { transformFilter } from '../model/Filter';
import { State } from './reducer';

export function getInitialState(): State {
    return {
        hover: null,
        draggedId: null,
        items: {},
        itemList: [],
        changes: {},
        changeList: [],
        panelNames: [],
        panelList: [{
            viewedItemList: [],
            itemsMeta: {},
            options: {
                filters: [
                    transformFilter({
                        id: 'roots',
                        name: 'Hide non-root items',
                        f: () => () => false,
                        rule: { name: 'noParents' },
                        on: true
                    }),
                    transformFilter({
                        id: 'no-templates',
                        name: 'Hide template items',
                        f: () => () => false,
                        rule: { name: 'isGiven', field: 'template' },
                        on: true
                    }),
                    transformFilter({
                        id: 'no-generateds',
                        name: 'Hide generated items',
                        f: () => () => false,
                        rule: { name: 'isGiven', field: 'generated' },
                        on: false
                    }),
                    transformFilter({
                        id: 'skip-hashtags',
                        name: 'Hide hashtags at root',
                        f: () => () => false,
                        rule: { name: 'isGiven', field: 'hashtag' },
                        on: true
                    }),
                    transformFilter({
                        id: 'not-deleted',
                        name: 'Hide deleted items',
                        f: () => () => false,
                        rule: { name: 'isNot', field: 'deleted', value: true },
                        on: true
                    }),
                    transformFilter({
                        id: 'not-done',
                        name: 'Hide done items',
                        f: () => () => false,
                        rule: { name: 'isNot', field: 'state', value: 'done' },
                        on: true
                    }),
                ],
                search: '',
                order: { attribute: 'priority', asc: true },
            }
        }],
        lastAlive: [],
        version: 0
    }
};
