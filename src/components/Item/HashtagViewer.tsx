import React from 'react';
import { useSelector } from 'react-redux';
import { ItemId } from '../../model/Item/ItemId';
import { RootState } from '../../ReduxStore';
import { HashtagInfo } from '../../model/Item/ViewItem';
import { Hashtag } from '../Hashtag';
import { hashtagRibbonStyle } from './ItemViewer/ItemViewer.style';

export const HashtagViewer: React.FC = () => {
  const { items, itemList } = useSelector(
    (state: RootState) => state.appReducer
  );

  const sprintItemIds = itemList.filter(
    (itemId: ItemId) =>         
      items[itemId].originalFields.hashtag &&
      items[itemId].originalFields.hashtag.value,
  );

  const idToHashtagInfo = (id:ItemId):HashtagInfo => {
    return {
      id, 
      color: items[id].originalFields.color && items[id].originalFields.color.value,
      hashtag: items[id].originalFields.hashtag && items[id].originalFields.hashtag.value
    };
  };

  return (
    <div>
      <div className={hashtagRibbonStyle}>
        {sprintItemIds
          .map(id => 
            <Hashtag hashtag={idToHashtagInfo(id)} key={id} />
          )}  
      </div>
    </div>
  );
};
