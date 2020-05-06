import React, { useCallback, useState } from 'react';
import { ItemViewer } from './ItemViewer';
import { ItemId } from '../../model/Item/ItemId';
import { useSelector } from 'react-redux';
import { ItemAdderViewer } from './ItemAdderViewer';

export const RootItemViewer: React.FC = () => {
  const { items, list, filters } = useSelector(
    (state: any) => state.appReducer
  );

  const [showChildrenAdder, setShowChildrenAdder] = useState(false);

  const handleNew = useCallback(() => {
    setShowChildrenAdder(true);
  }, []);

  const handleNewClose = useCallback(() => {
    setShowChildrenAdder(false);
  }, []);

  //   const order = (arr: ItemId[]): ItemId[] => {
  //     arr.sort((a, b) => {
  //       if (
  //         items[a].originalFields.title.value <
  //         items[b].originalFields.title.value
  //       )
  //         return -1;
  //       if (
  //         items[a].originalFields.title.value >
  //         items[b].originalFields.title.value
  //       )
  //         return 1;
  //       return 0;
  //     });
  //     return arr;
  //   };

  //   const f = (x: ItemId) => {
  //     return (
  //       items[x].parents.length === 0 && true
  //       //(items[x].originalFields.title &&
  //       //  items[x].originalFields.title.value.includes('alma')) &&
  //       //(!items[x].originalFields.deleted ||
  //       //  items[x].originalFields.deleted.value !== true)
  //     );
  //   };

  const f = (x: ItemId) => {
    for (const filter of filters) {
      if (filter.on && !filter.f(items)(x)) {
        return false;
      }
    }
    return true;
  };

  return (
    <div>
      {list.filter(f).map((id: ItemId) => (
        <ItemViewer key={id} item={items[id]} />
      ))}
      {showChildrenAdder && (
        <ItemAdderViewer parentId={undefined} onClose={handleNewClose} />
      )}
      <button onClick={handleNew}>Add</button>
    </div>
  );
};
