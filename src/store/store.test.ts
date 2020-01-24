import { createStore } from 'redux';
import { rootReducer } from '.';
// import { UpdateItem, StoredItemState } from './state/Item';
import { createItem } from './actions';
import { Change, StoredChange, StoredChangeState } from './state/Change';
import { Item, StoredItem, StoredItemState } from './state/Item';

describe('store', () => {
  it('create item', () => {
    const store = createStore(rootReducer);

    const item: Item = {
      id: '1',
      fields: {
        title: 'New item',
        createdAt: '2020-01-23T20:37:36.711Z',
        description: '',
        state: 'todo'
      }
    };

    const change: Change = {
      type: 'CreateItem',
      id: '1',
      data: {
        item
      }
    };

    const storedItem: StoredItem = {
      id: item.id,
      fieldsCentral: {},
      fieldsLocal: item.fields,
      changes: ['1'],
      state: StoredItemState.Creating
    };

    const storedChange: StoredChange = {
      ...change,
      state: StoredChangeState.Pending
    };

    store.dispatch(createItem.started(change));

    const r = store.getState().appReducer;
    expect(r.items).toEqual({
      byId: { '1': storedItem },
      allIds: ['1']
    });

    expect(r.changes).toEqual({
      byId: { '1': storedChange },
      allIds: ['1']
    });
  });

  it('created item', () => {
    const store = createStore(rootReducer);

    const item: Item = {
      id: '1',
      fields: {
        title: 'New item',
        createdAt: '2020-01-23T20:37:36.711Z',
        description: '',
        state: 'todo'
      }
    };

    const change: Change = {
      type: 'CreateItem',
      id: '1',
      data: {
        item
      }
    };

    const storedItem: StoredItem = {
      id: item.id,
      fieldsCentral: item.fields,
      fieldsLocal: {},
      changes: [],
      state: StoredItemState.Stable
    };

    const storedChange: StoredChange = {
      ...change,
      state: StoredChangeState.Done
    };

    const returnedChange: Change = {
      ...change
    };

    store.dispatch(createItem.started(change));
    store.dispatch(createItem.done({ params: change, result: returnedChange }));

    const r = store.getState().appReducer;
    expect(r.items).toEqual({
      byId: { '1': storedItem },
      allIds: ['1']
    });

    expect(r.changes).toEqual({
      byId: { '1': storedChange },
      allIds: ['1']
    });
  });
});

/*
const exampleItem = {
  fields: {
    title: 'Example item',
    createdAt: '2020-01-23T20:37:36.711Z',
    deadline: '2020-01-23T20:37:36.711Z',
    description: '',
    state: 'todo',
    children: [],
    parents: []
  },
  fieldsChanging: {},
  changes: [],
  state: StoredItemState.Creating
};

describe('store', () => {
  it('create item', () => {
    const store = createStore(rootReducer);

    store.dispatch({ type: 'CREATE_ITEM', payload: exampleItem });
    const repo = store.getState().appReducer.itemRepository;
    expect(repo.allIds.length).toEqual(1);
    const createdTmpId = repo.allIds[0];
    const { id, tmpId, ...result } = repo.byId[createdTmpId];
    expect(result).toEqual(exampleItem);
    expect(id).toBeDefined();
    expect(tmpId).toBeDefined();
    expect(id).toEqual(tmpId);
  });

  it('created item', () => {
    const store = createStore(rootReducer);

    store.dispatch({ type: 'CREATE_ITEM', payload: exampleItem });
    const repo = store.getState().appReducer.itemRepository;
    const tmpId = repo.allIds[0];

    const id = '12ef43ac';
    const exampleItemWithId = { id, tmpId, ...exampleItem };
    store.dispatch({ type: 'CREATED_ITEM', payload: exampleItemWithId });
    const repo2 = store.getState().appReducer.itemRepository;

    expect(repo2.allIds.length).toEqual(1);
    const createdTmpId = repo2.allIds[0];
    expect(repo2.byId[createdTmpId]).toEqual(exampleItemWithId);
  });

  it('update item', () => {
    const store = createStore(rootReducer);

    const id = '12ef43ac';
    const tmpId = undefined;
    const exampleItemWithId = { id, tmpId, ...exampleItem };
    store.dispatch({ type: 'CREATED_ITEM', payload: exampleItemWithId });

    const updateItem: UpdateItem = {
      id,
      changes: [
        {
          id,
          field: 'title',
          oldValue: 'Example item',
          newValue: 'New title'
        }
      ]
    };
    store.dispatch({ type: 'UPDATE_ITEM', payload: updateItem });

    const state = store.getState().appReducer.itemRepository;

    expect(state.allIds.length).toEqual(1);
    const createdTmpId = state.allIds[0];
    expect(state.byId[createdTmpId]).toEqual({
      ...exampleItemWithId,
      fields: { ...exampleItem.fields, title: 'Example item' },
      fieldsChanging: { title: 'New title' },
      changes: [
        {
          id,
          field: 'title',
          oldValue: 'Example item',
          newValue: 'New title'
        }
      ]
    });
  });

  it('updated item', () => {
    const store = createStore(rootReducer);

    const id = '12ef43ac';
    const tmpId = undefined;
    const exampleItemWithId = { id, tmpId, ...exampleItem };
    store.dispatch({ type: 'CREATED_ITEM', payload: exampleItemWithId });

    const updateItem: UpdateItem = {
      id,
      changes: [
        {
          id,
          field: 'title',
          oldValue: 'Example item',
          newValue: 'New title'
        }
      ]
    };
    store.dispatch({ type: 'UPDATE_ITEM', payload: updateItem });
    store.dispatch({ type: 'UPDATED_ITEM', payload: updateItem });

    const state = store.getState().appReducer.itemRepository;

    expect(state.allIds.length).toEqual(1);
    const createdTmpId = state.allIds[0];
    expect(state.byId[createdTmpId]).toEqual({
      ...exampleItemWithId,
      fields: { ...exampleItem.fields, title: 'New title' }
    });
  });
});
*/
