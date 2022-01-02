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
    panelId: number;
    removeHashtag?: () => void;
}

export const InvertedHashtag: React.FC<Props> = (props) => {
    const { hashtag, removeHashtag, panelId } = props;

    const actions: Actions = useContext(ActionsContext);

    const handleClick = useCallback(
        () => {
            actions.toggleInvertedHashtagFilter(panelId, hashtag);
        },
        [actions, hashtag, panelId]
    );

    const color = '#000000';

    return (
        <span
            className={hashtagStyle}
            style={{
                color: getContrastColor(color),
                backgroundColor: color
            }}
            key={hashtag.hashtag}
        >
            <span className={hashtagWidthStyle} onClick={handleClick}>!!!{hashtag.hashtag}</span>
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
