import React from 'react';
import { Link } from 'react-router-dom';
import { HashtagInfo } from '../model/Item/ViewItem';
import { getContrastColor } from '../ReduxStore/commons';
import {
  hashtagStyle,
  hashtagWidthStyle,
  linkStyle
} from './Item/ItemViewer/ItemViewer.style';

interface Props {
  hashtag: HashtagInfo;
  removeHashtag?: () => void;
}

export const Hashtag: React.FC<Props> = (props) => {
  const {hashtag, removeHashtag} = props;

  return (
    <span
      className={hashtagStyle}
      style={{
        color: getContrastColor(hashtag.color),
        backgroundColor: hashtag.color
      }}
      key={hashtag.hashtag}
    >
      <Link to={`/${hashtag.id}`} className={linkStyle}>
        <span className={hashtagWidthStyle}>#{hashtag.hashtag}</span>
      </Link>
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
