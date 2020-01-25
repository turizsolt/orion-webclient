import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Item as ItemTsx } from './Item';
import { ItemEditor } from './ItemEditor';
import { ItemAdder } from './ItemAdder';

export const ItemList: React.FC = () => {
  const { allIds: itemIds, byId: items } = useSelector(
    (state: RootState) => state.appReducer.items
  );
  const { selectedItemId: selectedId, version } = useSelector(
    (state: RootState) => state.appReducer
  );

  return (
    <>
      <div>version: {version}</div>
      <div style={{ display: 'flex', width: '100%' }}>
        <div style={{ width: '60%' }}>
          {itemIds.map(id => (
            <ItemTsx item={items[id]} key={id} />
          ))}
          <ItemAdder />
        </div>
        <div>{selectedId && <ItemEditor itemId={selectedId} />}</div>
      </div>
    </>
  );
};
