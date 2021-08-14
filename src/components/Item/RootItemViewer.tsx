import React, { useCallback, useState } from 'react';
import { ItemViewer } from './ItemViewer/ItemViewer';
import { ItemId } from '../../model/Item/ItemId';
import { useSelector } from 'react-redux';
import { ItemAdderViewer } from './ItemAdderViewer';
import { style, media } from 'typestyle';
import { OptionsViewer } from './OptionsViewer';

const containerStyle = style(
  media(
    { minWidth: 0, maxWidth: 899 },
    {
      display: 'flex',
      flexDirection: 'column',
      width: '100%'
    }
  ),
  media(
    { minWidth: 900 },
    { display: 'flex', flexDirection: 'row-reverse', width: '100%' }
  )
);

const mainStyle = style({ flexGrow: 1 });

export const RootItemViewer: React.FC = () => {
  const { items, viewedItemList } = useSelector(
    (state: any) => state.appReducer
  );

  const [showChildrenAdder, setShowChildrenAdder] = useState(false);

  const handleNew = useCallback(() => {
    setShowChildrenAdder(true);
  }, []);

  const handleNewClose = useCallback(() => {
    setShowChildrenAdder(false);
  }, []);

  return (
    <div className={containerStyle}>
      <OptionsViewer />
      <div className={mainStyle}>
        {viewedItemList.map((id: ItemId) => (
          <ItemViewer key={id} item={items[id]} parentId={null} path={''} />
        ))}
        {showChildrenAdder && (
          <ItemAdderViewer parentId={undefined} hashtagId={undefined} onClose={handleNewClose} />
        )}
        <button onClick={handleNew}>Add</button>
      </div>
    </div>
  );
};
