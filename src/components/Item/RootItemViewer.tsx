import React, { useCallback, useState } from 'react';
import { ItemViewer } from './ItemViewer';
import { ItemId } from '../../model/Item/ItemId';
import { useSelector } from 'react-redux';
import { ItemAdderViewer } from './ItemAdderViewer';

export const RootItemViewer: React.FC = () => {
  const { items, itemList, filters } = useSelector(
    (state: any) => state.appReducer
  );

  const [showChildrenAdder, setShowChildrenAdder] = useState(false);

  const handleNew = useCallback(() => {
    setShowChildrenAdder(true);
  }, []);

  const handleNewClose = useCallback(() => {
    setShowChildrenAdder(false);
  }, []);

  const order = (arr: ItemId[]): ItemId[] => {
    arr.sort((a, b) => {
      // console.log('items', items[a], items[b]);
      // return 0;
      if (
        !items[a].originalFields.priority &&
        !items[b].originalFields.priority
      ) {
        return 0;
      }

      if (!items[a].originalFields.priority) {
        return -1;
      }

      if (!items[b].originalFields.priority) {
        return 1;
      }

      if (
        parseInt(items[a].originalFields.priority.value, 10) <
        parseInt(items[b].originalFields.priority.value, 10)
      ) {
        return -1;
      }

      if (
        parseInt(items[a].originalFields.priority.value, 10) >
        parseInt(items[b].originalFields.priority.value, 10)
      ) {
        return 1;
      }

      return 0;
    });
    return arr;
  };

  const f = (x: ItemId) => {
    if (!items[x]) return false;

    for (const filter of filters) {
      if (filter.on && !filter.f(items)(x)) {
        return false;
      }
    }
    return true;
  };

  return (
    <div>
      {order(itemList)
        .filter(f)
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
