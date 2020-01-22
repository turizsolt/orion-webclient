import { createStore } from 'redux';
import { rootReducer } from '.';
import { UpdateItem } from './state/Item';

const exampleItem = {
  title: 'Example item',
  children: []
};

describe('store', () => {
  it('create item', () => {
    const store = createStore(rootReducer);

    store.dispatch({ type: 'CREATE_ITEM', payload: exampleItem });
    const state = store.getState().appReducer.itemRepository;
    expect(state.items.length).toEqual(1);
    const { id, tmpId, ...result } = state.items[0];
    expect(result).toEqual(exampleItem);
    expect(id).toBeDefined();
    expect(tmpId).toBeDefined();
    expect(id).toEqual(tmpId);
  });

  it('created item', () => {
    const store = createStore(rootReducer);

    store.dispatch({ type: 'CREATE_ITEM', payload: exampleItem });
    const { tmpId } = store.getState().appReducer.itemRepository.items[0];

    const id = '12ef43ac';
    const exampleItemWithId = { id, tmpId, exampleItem };
    store.dispatch({ type: 'CREATED_ITEM', payload: exampleItemWithId });
    const state = store.getState().appReducer.itemRepository;

    expect(state.items.length).toEqual(1);
    expect(state.items[0]).toEqual(exampleItemWithId);
  });

  it('update item', () => {
    const store = createStore(rootReducer);

    const id = '12ef43ac';
    const tmpId = undefined;
    const exampleItemWithId = { id, tmpId, exampleItem };
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

    expect(state.items.length).toEqual(1);
    expect(state.items[0]).toEqual({
      ...exampleItemWithId,
      title: 'New title'
    });
  });
});
