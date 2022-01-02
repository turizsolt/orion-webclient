
import { Filter, transformFilter } from '../model/Filter';
import { Panel, PanelOptions, State } from './reducer';

export function getInitialState(): State {
    return {
        hover: null,
        draggedId: null,
        items: {},
        itemList: [],
        changes: {},
        changeList: [],
        panelNames: [],
        panel: {
            options: getOptions(),
            list: [getDefaultPanel()],
        },
        lastAlive: [],
        version: 0
    }
};

export function getDefaultPanel(filter?: Filter): Panel {
    return {
        viewedItemList: [],
        itemsMeta: {},
        options: {
            filters: [...filter ? [transformFilter(filter)] : []],
            search: '',
            order: { attribute: undefined, asc: true },
        }
    };
}

export function getOptions(): PanelOptions {
    return {
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
                rule: { name: 'isNotGiven', field: 'template' },
                on: true
            }),
            transformFilter({
                id: 'no-generateds',
                name: 'Hide generated items',
                f: () => () => false,
                rule: { name: 'isNotGiven', field: 'generated' },
                on: false
            }),
            transformFilter({
                id: 'no-generators',
                name: 'Hide generatOR items',
                f: () => () => false,
                rule: { name: 'isNotGiven', field: 'generator' },
                on: true
            }),
            transformFilter({
                id: 'skip-hashtags',
                name: 'Hide hashtags at root',
                f: () => () => false,
                rule: { name: 'isNotGiven', field: 'hashtag' },
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
            transformFilter({
                id: 'not-rejected',
                name: 'Hide rejected items',
                f: () => () => false,
                rule: { name: 'isNot', field: 'state', value: 'rejected' },
                on: true
            }),
            transformFilter({
                id: 'seven-days',
                name: 'Next seven days',
                f: () => () => false,
                rule: {
                    name: 'days',
                    startDay: 0,
                    endDay: +6,
                },
                on: false
            }),
        ],
        search: '',
        order: { attribute: 'priority', asc: true },
    };
}
