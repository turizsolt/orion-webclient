import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { Item as ItemTsx } from './Item';
import { ItemEditor } from './ItemEditor';
import { Item } from '../store/state/Item';
import { Change } from '../store/state/Change';
import { createItem, createRelation } from '../store/actions';
import { ActualIdGenerator } from '../idGenerator/ActualIdGenerator';

const idGenerator = new ActualIdGenerator();

export const ItemList: React.FC = () => {
  const { allIds: itemIds, byId: items } = useSelector(
    (state: RootState) => state.appReducer.items
  );
  const { selectedItemId: selectedId, version } = useSelector(
    (state: RootState) => state.appReducer
  );

  const dispatch = useDispatch();

  const handleAddRandom = React.useCallback(() => {
    const item: Item = {
      id: idGenerator.generate(),
      fields: {
        title: 'New item',
        createdAt: new Date().toISOString(),
        description: '',
        state: 'todo'
      }
    };

    const change: Change = {
      type: 'CreateItem',
      id: idGenerator.generate(),
      data: {
        item
      }
    };

    dispatch(createItem.started(change));
  }, [dispatch]);

  const handleAddRandomChild = React.useCallback(() => {
    const change: Change = {
      id: idGenerator.generate(),
      type: 'CreateRelation',
      data: {
        parentId: itemIds[0],
        childId: itemIds[1]
      }
    };

    dispatch(createRelation.started(change));
  }, [dispatch, itemIds]);

  return (
    <>
      <div>version: {version}</div>
      <div style={{ display: 'flex', width: '100%' }}>
        <div style={{ width: '60%' }}>
          {itemIds.map(id => (
            <ItemTsx item={items[id]} key={id} />
          ))}
          <button onClick={handleAddRandom}>Add random</button>
          <button onClick={handleAddRandomChild}>Random child</button>
        </div>
        <div>{selectedId && <ItemEditor itemId={selectedId} />}</div>
      </div>
    </>
  );
};
