import { createStore } from 'redux';
import { rootReducer } from '../..';
import { updateItem, createItem } from '../../actions';
import {
  change,
  updateChange,
  storedChangeCreate,
  returnedChange,
  storedItemDone,
  storedItemPending,
  storedChangeUpdatePending,
  storedChangeUpdateDone
} from './data';

describe('store', () => {
  it('update item', () => {
    const store = createStore(rootReducer);
    store.dispatch(createItem.done({ params: change, result: returnedChange }));
    store.dispatch(updateItem.started(updateChange));
    const r = store.getState().appReducer;

    expect(r.items).toEqual({
      byId: { '1': storedItemPending },
      allIds: ['1']
    });

    expect(r.changes).toEqual({
      byId: { '1': storedChangeCreate, '2': storedChangeUpdatePending },
      allIds: ['1', '2']
    });
  });

  it('updated item', () => {
    const store = createStore(rootReducer);
    store.dispatch(createItem.done({ params: change, result: returnedChange }));
    store.dispatch(updateItem.started(updateChange));
    store.dispatch(
      updateItem.done({ params: updateChange, result: updateChange })
    );
    const r = store.getState().appReducer;

    expect(r.items).toEqual({
      byId: { '1': storedItemDone },
      allIds: ['1']
    });

    expect(r.changes).toEqual({
      byId: { '1': storedChangeCreate, '2': storedChangeUpdateDone },
      allIds: ['1', '2']
    });
  });

  it('just updated item', () => {
    const store = createStore(rootReducer);
    store.dispatch(createItem.done({ params: change, result: returnedChange }));
    store.dispatch(
      updateItem.done({ params: updateChange, result: updateChange })
    );
    const r = store.getState().appReducer;

    expect(r.items).toEqual({
      byId: { '1': storedItemDone },
      allIds: ['1']
    });

    expect(r.changes).toEqual({
      byId: { '1': storedChangeCreate, '2': storedChangeUpdateDone },
      allIds: ['1', '2']
    });
  });
});
