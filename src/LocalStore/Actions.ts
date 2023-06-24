import { Store } from './Store';
import {
    ChangeResponse,
    RelationChange,
    ItemChange
} from '../model/Change/Change';
import { ItemId } from '../model/Item/ItemId';
import { RelationType } from '../model/Relation/RelationType';
import { Dispatcher } from './Dispatcher';
import { initServerSocket } from './initServerSocket';
import { LocalStorage } from './LocalStorage';
import { ServerCommunication } from './ServerCommunication';
import { FieldName } from '../model/Item/FieldName';
import { ActualIdGenerator } from '../idGenerator/ActualIdGenerator';
import { Transaction } from '../model/Transaction/Transaction';
import {
    hoverItem,
    draggedItem,
    toggleFilter,
    search,
    order,
    toggleHashtagFilter,
    setPanelNames,
    updatesPanelOptions,
    removePanel,
    addPanel,
    toggleInvertedHashtagFilter
} from '../ReduxStore/actions';
import { HashtagInfo } from '../model/Item/ViewItem';
import { Panel, PanelOptions } from '../ReduxStore/reducer';
import { transformFilter } from '../model/Filter';

const idGen = new ActualIdGenerator();

export class Actions {
    private store: Store;
    constructor(
        private dispatcher: Dispatcher,
        private localStorage: LocalStorage,
        private serverCommunication: ServerCommunication
    ) {
        this.store = new Store(dispatcher, localStorage, serverCommunication);
        initServerSocket(this.store, this.localStorage);
    }

    getStore(): Store {
        return this.store;
    }

    ping(): void {
        this.store.ping();
        this.store.updateAlive((new Date()).getTime(), 'ping ' + this.serverCommunication.connected().toString());
    }

    reconnect(): void {
        this.serverCommunication.toggleOpen();
    }

    login(username: string, password: string): void {
        (async () => {
            const rawResponse = await fetch((window as any).loginUrl + 'login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            const content = await rawResponse.json();

            if (content.token) {
                this.setToken(content.token);
            }
        })();
    }

    setToken(token: string): void {
        this.localStorage.setItem('loginToken', token);
        this.serverCommunication.reopen();
    }

    logout(): void {
        this.localStorage.setItem('loginToken', null);
        this.serverCommunication.close();
    }

    changeItem(
        itemId: ItemId,
        field: FieldName,
        oldValue: any,
        newValue: any
    ): void {
        if (oldValue === newValue) return;

        const change: ItemChange = {
            type: 'ItemChange',
            itemId,
            changeId: idGen.generate(),
            field,
            oldValue,
            newValue,
            response: ChangeResponse.Pending
        };
        const transaction = new Transaction();
        transaction.add(change);
        this.store.commit(transaction);
    }

    hover(
        newHover: {
            path: string;
            place: string;
            id: ItemId;
            parentId: ItemId | null;
        } | null
    ) {
        this.dispatcher.dispatch(hoverItem(newHover));
    }

    dragged(itemId: ItemId | null) {
        this.dispatcher.dispatch(draggedItem(itemId));
    }

    toggleFilter(panelId: number, filterName: string) {
        this.dispatcher.dispatch(toggleFilter({ panelId, filterName }));
    }

    search(panelId: number, searchString: string) {
        this.dispatcher.dispatch(search({ panelId, searchString }));
    }

    order(panelId: number, props: { attribute?: string; asc?: boolean }) {
        this.dispatcher.dispatch(order({ panelId, ...props }));
    }

    toggleHashtagFilter(panelId: number, hashtagInfo: HashtagInfo) {
        this.dispatcher.dispatch(toggleHashtagFilter({ panelId, hashtagInfo }));
    }

    toggleInvertedHashtagFilter(panelId: number, hashtagInfo: HashtagInfo) {
        this.dispatcher.dispatch(toggleInvertedHashtagFilter({ panelId, hashtagInfo }));
    }

    createItem(field: FieldName, newValue: any): ItemId {
        const change: ItemChange = {
            type: 'ItemChange',
            itemId: idGen.generate(),
            changeId: idGen.generate(),
            field,
            oldValue: undefined,
            newValue,
            response: ChangeResponse.Pending
        };
        const transaction = new Transaction();
        transaction.add(change);
        this.store.commit(transaction);

        return change.itemId;
    }

    addRelation(
        oneId: ItemId,
        relationType: RelationType,
        otherId: ItemId
    ): void {
        const change: RelationChange = {
            type: 'AddRelation',
            oneSideId: oneId,
            relation: relationType,
            otherSideId: otherId,
            changeId: idGen.generate(),
            response: ChangeResponse.Pending
        };
        const transaction = new Transaction();
        transaction.add(change);
        this.store.commit(transaction);
    }

    removeRelation(
        oneId: ItemId,
        relationType: RelationType,
        otherId: ItemId
    ): void {
        const change: RelationChange = {
            type: 'RemoveRelation',
            oneSideId: oneId,
            relation: relationType,
            otherSideId: otherId,
            changeId: idGen.generate(),
            response: ChangeResponse.Pending
        };
        const transaction = new Transaction();
        transaction.add(change);
        this.store.commit(transaction);
    }

    shallowCopy(id: ItemId): ItemId {
        const newId: ItemId = idGen.generate();
        const transaction = new Transaction();

        const storedItem = this.store.getItem(id);
        for (let field of storedItem.getFields()) {
            const change: ItemChange = {
                type: 'ItemChange',
                itemId: newId,
                changeId: idGen.generate(),
                field,
                oldValue: undefined,
                newValue: storedItem.getField(field),
                response: ChangeResponse.Pending
            };
            transaction.add(change);
        }

        for (let relation of storedItem.getRelations()) {
            if (['hash', 'responsible', 'parent'].includes(relation.type)) {
                const change: RelationChange = {
                    type: 'AddRelation',
                    oneSideId: newId,
                    relation: relation.type,
                    otherSideId: relation.otherSideId,
                    changeId: idGen.generate(),
                    response: ChangeResponse.Pending
                };
                transaction.add(change);
            }
        }

        const change: RelationChange = {
            type: 'AddRelation',
            oneSideId: id,
            relation: RelationType.Copied,
            otherSideId: newId,
            changeId: idGen.generate(),
            response: ChangeResponse.Pending
        };

        transaction.add(change);

        this.store.commit(transaction);

        return newId;
    }

    initPanels(panelName: string): void {
        const panelNames: string[] = JSON.parse(this.localStorage.getItem('panelNames'));
        const panelOptions: PanelOptions[] = JSON.parse(this.localStorage.getItem('panelName-' + panelName));

        this.dispatcher.dispatch(setPanelNames(panelNames || []));

        if (panelOptions) {
            panelOptions.forEach((po, ind) => {
                panelOptions[ind] = ({ ...po, filters: po.filters.map(transformFilter) })
            });
            this.dispatcher.dispatch(updatesPanelOptions(panelOptions));
        }
    }

    setPanels(panels: Panel[]): void {
        this.dispatcher.dispatch(updatesPanelOptions(panels.map(p => p.options)));
    }

    savePanels(panelName: string, panelOptions: PanelOptions[]): void {
        const panelNames: string[] = JSON.parse(this.localStorage.getItem('panelNames')) || [];
        if (!panelNames.includes(panelName)) {
            panelNames.push(panelName);
            this.localStorage.setItem('panelNames', JSON.stringify(panelNames));
            this.dispatcher.dispatch(setPanelNames(panelNames));
        }

        this.localStorage.setItem('panelName-' + panelName, JSON.stringify(panelOptions));
    }

    addPanel(): void {
        this.dispatcher.dispatch(addPanel(null));
    }

    removePanel(panelId: number): void {
        this.dispatcher.dispatch(removePanel(panelId));
    }
}
