import React from 'react';
import { ItemViewer } from './ItemViewer/ItemViewer';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { ItemId } from '../../model/Item/ItemId';
import { RootState } from '../../ReduxStore';
import { HashtagInfo } from '../../model/Item/ViewItem';

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

  return (
    <div>
      <div>Hashtag {hashtagId}</div>
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
      </div>
    </div>
  );
};
