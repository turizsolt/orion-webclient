import React, { useCallback, useState } from 'react';
import { ItemViewer } from './ItemViewer/ItemViewer';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { ItemId } from '../../model/Item/ItemId';
import { RootState } from '../../ReduxStore';
import { HashtagInfo } from '../../model/Item/ViewItem';
import { Hashtag } from '../Hashtag';
import { ItemAdderViewer } from './ItemAdderViewer';

export const OneHashtagViewer: React.FC = () => {
  const { id: hashtagId } = useParams<{id:ItemId}>();
  const { items, itemList } = useSelector(
    (state: RootState) => state.appReducer
  );

  const hashtagItemIds = itemList.filter(
    (itemId: ItemId) =>
      items[itemId] &&
      items[itemId].hashtags.findIndex(
        (x: HashtagInfo) => x.id === hashtagId
      ) !== -1
  );

  const idToHashtagInfo = (id:ItemId):HashtagInfo => {
    return {
      id, 
      color: items[id].originalFields.color && items[id].originalFields.color.value,
      hashtag: items[id].originalFields.hashtag && items[id].originalFields.hashtag.value
    };
  };

  const [showChildrenAdder, setShowChildrenAdder] = useState(false);

  const handleNew = useCallback(() => {
    setShowChildrenAdder(true);
  }, []);

  const handleNewClose = useCallback(() => {
    setShowChildrenAdder(false);
  }, []);

  return (
    <div>
      <Hashtag hashtag={idToHashtagInfo(hashtagId)}/>
      <div>
        {hashtagItemIds
          .map(id => (
            <ItemViewer
              key={id}
              item={items[id]}
              parentId={null}
              path={''}
            />
          ))}
        {showChildrenAdder && (
          <ItemAdderViewer parentId={undefined} hashtagId={hashtagId} onClose={handleNewClose} />
        )}
        <button onClick={handleNew}>Add</button>
      </div>
      
    </div>
  );
};
