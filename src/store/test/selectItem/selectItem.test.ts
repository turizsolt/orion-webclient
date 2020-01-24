import { createStore } from 'redux';
import { rootReducer } from '../..';
import { selectItem } from '../../actions';

describe('store', () => {
  it('select item', () => {
    const store = createStore(rootReducer);
    store.dispatch(selectItem({ id: '1' }));
    const r = store.getState().appReducer;

    expect(r.selectedItemId).toEqual('1');
  });

  it('unselect item', () => {
    const store = createStore(rootReducer);
    store.dispatch(selectItem({ id: null }));
    const r = store.getState().appReducer;

    expect(r.selectedItemId).toBeNull();
  });
});
