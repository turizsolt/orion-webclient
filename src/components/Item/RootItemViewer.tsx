import React, { useContext, useCallback } from 'react';
import { ItemViewer } from './ItemViewer';
import { ItemId } from '../../model/Item/ItemId';
import { useSelector } from 'react-redux';
import { LocalStoreContext } from '../../App';
import { LocalStore } from '../../LocalStore/LocalStore';

export const RootItemViewer: React.FC = () => {
  const { items, list } = useSelector((state: any) => state.appReducer);
  const local: LocalStore = useContext(LocalStoreContext);

  const handleClick = useCallback(() => {
    local.createItem();
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
