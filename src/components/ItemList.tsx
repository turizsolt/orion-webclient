import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { Item } from './Item';

export const ItemList: React.FC = () => {
  const { items } = useSelector(
    (state: RootState) => state.appReducer.itemRepository
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
    <div>
      {items.map(item => (
        <Item item={item} key={item.id} />
      ))}
      <button onClick={handleAddRandom}>Add random</button>
    </div>
  );
};
