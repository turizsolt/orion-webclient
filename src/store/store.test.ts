import { createStore } from 'redux';
import { rootReducer } from '.';
import { UpdateItem } from './state/Item';

const exampleItem = {
  fields: {
    title: 'Example item'
  },
  fieldsChanging: {},
  changes: []
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
    const createdTmpId = repo.allIds[0];
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
      fields: { title: 'Example item' },
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
      fields: { title: 'New title' }
    });
  });
});
