import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { Item } from './Item';
import { ItemEditor } from './ItemEditor';

export const ItemList: React.FC = () => {
  const { items } = useSelector(
    (state: RootState) => state.appReducer.itemRepository
  );
  const selectedItem = useSelector(
    (state: RootState) => state.appReducer.selectedItem
  );

  const dispatch = useDispatch();

  const handleAddRandom = React.useCallback(() => {
    dispatch({
      type: 'CREATE_ITEM',
      payload: {
        fields: { title: 'TTL' + Math.random() },
        fieldsChanging: {},
        changes: [],
        tmpId: 'TMP' + Math.random()
      }
    });
  }, [dispatch]);

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <div style={{ width: '60%' }}>
        {items.map(item => (
          <Item item={item} key={item.id} />
        ))}
        <button onClick={handleAddRandom}>Add random</button>
      </div>
      <div>{selectedItem && <ItemEditor itemId={selectedItem} />}</div>
    </div>
  );
};
