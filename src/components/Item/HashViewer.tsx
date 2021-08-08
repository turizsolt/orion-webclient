import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { style, media } from 'typestyle';
import { ItemId } from '../../model/Item/ItemId';
import { ItemAdderViewer } from './ItemAdderViewer';
import { ItemViewer } from './ItemViewer/ItemViewer';
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
    { display: 'flex', flexDirection: 'row-reverse', width: '80%' }
  )
);

const mainStyle = style({ flexGrow: 1 });

export const HashViewer: React.FC = () => {
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

        <div className={mainStyle}>
          {viewedItemList.map((id: ItemId) => (
            <ItemViewer key={id} item={items[id]} parentId={null} path={''} />
          ))}
          {showChildrenAdder && (
            <ItemAdderViewer parentId={undefined} onClose={handleNewClose} />
          )}
          <button onClick={handleNew}>Add</button>
        </div>
      </div>
    );

  };
  