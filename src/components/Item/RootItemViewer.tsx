import React, { useContext, useCallback } from 'react';
import { ItemViewer } from './ItemViewer';
import { ItemId } from '../../model/Item/ItemId';
import { ActualIdGenerator } from '../../idGenerator/ActualIdGenerator';
import { useSelector } from 'react-redux';
import { LocalStoreContext } from '../../App';
import { LocalStore } from '../../LocalStore/LocalStore';

const idGen = new ActualIdGenerator();

export const RootItemViewer: React.FC = () => {
  const { items, list } = useSelector((state: any) => state.appReducer);
  const local: LocalStore = useContext(LocalStoreContext);

  const handleClick = useCallback(() => {
    const id = idGen.generate();
    local.changeItem({
      id,
      fieldName: 'title',
      oldValue: undefined,
      newValue: 'rndstr'
    });
    local.changeItem({
      id: id,
      fieldName: 'description',
      oldValue: undefined,
      newValue: 'arghhhh'
    });
    local.changeItem({
      id: id,
      fieldName: 'isIt',
      oldValue: undefined,
      newValue: true
    });
  }, [local]);

  return (
    <div>
      {list.map((id: ItemId) => (
        <ItemViewer key={id} item={items[id]} />
      ))}
      <button onClick={handleClick}>Add</button>
    </div>
  );
};
