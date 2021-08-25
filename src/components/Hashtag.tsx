import React, { useCallback, useContext } from 'react';
import { ActionsContext } from '../App';
import { Actions } from '../LocalStore/Actions';
import { HashtagInfo } from '../model/Item/ViewItem';
import { getContrastColor } from '../ReduxStore/commons';
import {
  hashtagStyle,
  hashtagWidthStyle,
} from './Item/ItemViewer/ItemViewer.style';

interface Props {
  hashtag: HashtagInfo;
  removeHashtag?: () => void;
}

export const Hashtag: React.FC<Props> = (props) => {
  const { hashtag, removeHashtag } = props;

  const actions: Actions = useContext(ActionsContext);

  const handleClick = useCallback(
    () => {
      actions.toggleHashtagFilter(hashtag);
    },
    [actions, hashtag]
  );

  return (
    <span
      className={hashtagStyle}
      style={{
        color: getContrastColor(hashtag.color),
        backgroundColor: hashtag.color
      }}
      key={hashtag.hashtag}
    >
      <span className={hashtagWidthStyle} onClick={handleClick}>#{hashtag.hashtag}</span>
      {removeHashtag && <>
        &nbsp;
        <span
          onClick={removeHashtag}
          style={{ cursor: 'pointer' }}
        >
          (x)
        </span>
      </>}
    </span>
  );
};
