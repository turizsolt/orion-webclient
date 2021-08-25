import React, { useCallback, useState } from 'react';
import { ItemViewer } from './ItemViewer/ItemViewer';
import { ItemId } from '../../model/Item/ItemId';
import { useSelector } from 'react-redux';
import { ItemAdderViewer } from './ItemAdderViewer';
import { style, media } from 'typestyle';
import { OptionsViewer } from './OptionsViewer';
import { HashtagInfo } from '../../model/Item/ViewItem';
import { Hashtag } from '../Hashtag';
import { hashtagRibbonStyle } from './ItemViewer/ItemViewer.style';

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
  const { items, itemList, viewedItemList } = useSelector(
    (state: any) => state.appReducer
  );

  const [showChildrenAdder, setShowChildrenAdder] = useState(false);

  const hashtagItemIds: ItemId[] = itemList.filter(
    (itemId: ItemId) =>
      items[itemId].originalFields.hashtag &&
      items[itemId].originalFields.hashtag.value,
  );

  const idToHashtagInfo = (id: ItemId): HashtagInfo => {
    return {
      id,
      color: items[id].originalFields.color && items[id].originalFields.color.value,
      hashtag: items[id].originalFields.hashtag && items[id].originalFields.hashtag.value
    };
  };

  const handleNew = useCallback(() => {
    setShowChildrenAdder(true);
  }, []);

  const handleNewClose = useCallback(() => {
    setShowChildrenAdder(false);
  }, []);

  return (
    <div>
      <div>
        <div className={hashtagRibbonStyle}>
          {hashtagItemIds
            .map(id =>
              <Hashtag hashtag={idToHashtagInfo(id)} key={id} />
            )}
        </div>
      </div>
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
    </div>
  );
};
