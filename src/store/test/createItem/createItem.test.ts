import { createStore } from 'redux';
import { rootReducer } from '../..';
import { createItem } from '../../actions';
import {
  change,
  storedItemDone,
  storedItemPending,
  storedChangePending,
  returnedChange,
  storedChangeDone
} from './data';

describe('store', () => {
  it('create item', () => {
    const store = createStore(rootReducer);
    store.dispatch(createItem.started(change));
    const r = store.getState().appReducer;

    expect(r.items).toEqual({
      byId: { '1': storedItemPending },
      allIds: ['1']
    });

    expect(r.changes).toEqual({
      byId: { '1': storedChangePending },
      allIds: ['1']
    });
  });

  it('created item', () => {
    const store = createStore(rootReducer);
    store.dispatch(createItem.started(change));
    store.dispatch(createItem.done({ params: change, result: returnedChange }));
    const r = store.getState().appReducer;

    expect(r.items).toEqual({
      byId: { '1': storedItemDone },
      allIds: ['1']
    });

    expect(r.changes).toEqual({
      byId: { '1': storedChangeDone },
      allIds: ['1']
    });
  });

  it('created item', () => {
    const store = createStore(rootReducer);
    store.dispatch(createItem.done({ params: change, result: returnedChange }));
    const r = store.getState().appReducer;

    expect(r.items).toEqual({
      byId: { '1': storedItemDone },
      allIds: ['1']
    });

    expect(r.changes).toEqual({
      byId: { '1': storedChangeDone },
      allIds: ['1']
    });
  });
});
