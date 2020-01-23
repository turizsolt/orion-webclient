import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { Item } from './Item';
import { ItemEditor } from './ItemEditor';

export const ItemList: React.FC = () => {
  const { allIds: itemIds, byId: items } = useSelector(
    (state: RootState) => state.appReducer.itemRepository
  );
  const { selectedId, version } = useSelector(
    (state: RootState) => state.appReducer
  );

  const dispatch = useDispatch();

  const handleAddRandom = React.useCallback(() => {
    dispatch({
      type: 'CREATE_ITEM',
      payload: {
        fields: { title: 'TTL' + Math.random() }
      }
    });
  }, [dispatch]);

  return (
    <>
      <div>version: {version}</div>
      <div style={{ display: 'flex', width: '100%' }}>
        <div style={{ width: '60%' }}>
          {itemIds.map(id => (
            <Item item={items[id]} key={id} />
          ))}
          <button onClick={handleAddRandom}>Add random</button>
        </div>
        <div>{selectedId && <ItemEditor itemId={selectedId} />}</div>
      </div>
    </>
  );
};
