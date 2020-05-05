import React, { useCallback, useState } from 'react';
import { ItemViewer } from './ItemViewer';
import { ItemId } from '../../model/Item/ItemId';
import { useSelector } from 'react-redux';
import { ItemAdderViewer } from './ItemAdderViewer';

export const RootItemViewer: React.FC = () => {
  const { items, list } = useSelector((state: any) => state.appReducer);

  const [showChildrenAdder, setShowChildrenAdder] = useState(false);

  const handleNew = useCallback(() => {
    setShowChildrenAdder(true);
  }, []);

  const handleNewClose = useCallback(() => {
    setShowChildrenAdder(false);
  }, []);

  return (
    <div>
      {list
        .filter((x: ItemId) => items[x].parents.length === 0)
        .map((id: ItemId) => (
          <ItemViewer key={id} item={items[id]} />
        ))}
      {showChildrenAdder && (
        <ItemAdderViewer parentId={undefined} onClose={handleNewClose} />
      )}
      <button onClick={handleNew}>Add</button>
    </div>
  );
};
