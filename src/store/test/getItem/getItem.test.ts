import { createStore } from 'redux';
import { rootReducer } from '../..';
import { getItem } from '../../actions';
import { storedItemLoading } from './data';

describe('store', () => {
  it('get item', () => {
    const store = createStore(rootReducer);
    store.dispatch(getItem.started({ id: '1' }));
    const r = store.getState().appReducer;

    expect(r.items).toEqual({
      byId: { '1': storedItemLoading },
      allIds: ['1']
    });
  });
});
