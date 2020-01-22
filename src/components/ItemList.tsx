import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';

export const ItemList: React.FC = () => {
  const { items } = useSelector(
    (state: RootState) => state.appReducer.itemRepository
  );
  const dispatch = useDispatch();

  const handleAddRandom = React.useCallback(() => {
    dispatch({
      type: 'CREATE_ITEM',
      payload: {
        title: 'FRG' + Math.random(),
        children: [],
        id: 'TMP' + Math.random()
      }
    });
  }, [dispatch]);

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>{item.id}</div>
      ))}
      <button onClick={handleAddRandom}>Add random</button>
    </div>
  );
};
