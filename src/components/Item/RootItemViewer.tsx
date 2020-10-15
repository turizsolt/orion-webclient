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

  const x = (c: string) => {
    if (
      !items[c] ||
      !items[c].originalFields ||
      !items[c].originalFields.priority ||
      !items[c].originalFields.priority.value
    ) {
      return 0;
    }
    return parseInt(items[c].originalFields.priority.value, 10);
  };

  const order = (arr: ItemId[]): ItemId[] => {
    arr.sort((a, b) => {
      if (x(a) < x(b)) return 1;
      if (x(a) > x(b)) return -1;
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
      {order(itemList.filter(f)).map((id: ItemId) => (
        <ItemViewer key={id} item={items[id]} parentId={null} path={''} />
      ))}
      {showChildrenAdder && (
        <ItemAdderViewer parentId={undefined} onClose={handleNewClose} />
      )}
      <button onClick={handleNew}>Add</button>
    </div>
  );
};
