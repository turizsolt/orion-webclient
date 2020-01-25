import { createStore } from 'redux';
import { rootReducer } from '../..';
import { createItem, createRelation } from '../../actions';
import {
  createParent,
  createChild,
  newRelation,
  storedParentChanging,
  storedChildrenChanging,
  storedCreateParentDone,
  storedCreateChildDone,
  storedChangePending,
  storedParentDone,
  storedChildrenDone,
  storedChangeDone
} from './data';

describe('store', () => {
  it('create relation', () => {
    const store = createStore(rootReducer);
    store.dispatch(
      createItem.done({ params: createParent, result: createParent })
    );
    store.dispatch(
      createItem.done({ params: createChild, result: createChild })
    );
    store.dispatch(createRelation.started(newRelation));
    const r = store.getState().appReducer;

    expect(r.items).toEqual({
      byId: { '1': storedParentChanging, '3': storedChildrenChanging },
      allIds: ['1', '3']
    });

    expect(r.changes).toEqual({
      byId: {
        '2': storedCreateParentDone,
        '4': storedCreateChildDone,
        '5': storedChangePending
      },
      allIds: ['2', '4', '5']
    });
  });

  it('created relation', () => {
    const store = createStore(rootReducer);
    store.dispatch(
      createItem.done({ params: createParent, result: createParent })
    );
    store.dispatch(
      createItem.done({ params: createChild, result: createChild })
    );
    store.dispatch(createRelation.started(newRelation));
    store.dispatch(
      createRelation.done({ params: newRelation, result: newRelation })
    );
    const r = store.getState().appReducer;

    expect(r.items).toEqual({
      byId: { '1': storedParentDone, '3': storedChildrenDone },
      allIds: ['1', '3']
    });

    expect(r.changes).toEqual({
      byId: {
        '2': storedCreateParentDone,
        '4': storedCreateChildDone,
        '5': storedChangeDone
      },
      allIds: ['2', '4', '5']
    });
  });

  it('just created relation', () => {
    const store = createStore(rootReducer);
    store.dispatch(
      createItem.done({ params: createParent, result: createParent })
    );
    store.dispatch(
      createItem.done({ params: createChild, result: createChild })
    );
    store.dispatch(
      createRelation.done({ params: newRelation, result: newRelation })
    );
    const r = store.getState().appReducer;

    expect(r.items).toEqual({
      byId: { '1': storedParentDone, '3': storedChildrenDone },
      allIds: ['1', '3']
    });

    expect(r.changes).toEqual({
      byId: {
        '2': storedCreateParentDone,
        '4': storedCreateChildDone,
        '5': storedChangeDone
      },
      allIds: ['2', '4', '5']
    });
  });
});
