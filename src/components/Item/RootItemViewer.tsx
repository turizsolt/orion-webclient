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
import { Filter } from '../../model/Filter';
import { ConnectionChecker } from './ConnectionChecker';

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

export const showOptsStyle = style({
    padding: '5px',
    borderRadius: '5px',
    border: '1px solid black',
    marginBottom: '5px',
    marginLeft: 'auto',
    '&:hover': {
        cursor: 'pointer'
    }
} as any);

const optionsHashOuter = style({
    paddingTop: '5px',
    paddingBottom: '5px',
    marginBottom: '5px'
});

const mainStyle = style({ flexGrow: 1 });

export const RootItemViewer: React.FC = () => {
    const { items, itemList, viewedItemList, filters } = useSelector(
        (state: any) => state.appReducer
    );

    const [showChildrenAdder, setShowChildrenAdder] = useState(false);

    const hashtagItemIds: ItemId[] = itemList.filter(
        (itemId: ItemId) =>
            items[itemId] &&
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

    const [showOptions, setShowOptions] = useState(false);
    const handleToggleOptions = useCallback(() => {
        setShowOptions(!showOptions);
    }, [showOptions]);

    const showAllHashtags = !filters.some((filter: Filter) => filter.hashtag);

    return (
        <div>
            <div><i>Version 2021.12.15.2</i></div>
            <ConnectionChecker />  
            <div>
                {showAllHashtags && <>
                    <div className={hashtagRibbonStyle}>
                        {hashtagItemIds
                            .map(id =>
                                <Hashtag hashtag={idToHashtagInfo(id)} key={id} />
                            )}
                    </div>
                    <hr />
                </>}
                <div className={hashtagRibbonStyle}>
                    {filters.map((filter: Filter) => (
                        <div key={filter.id}>
                            {filter.hashtag && <div className={optionsHashOuter}>
                                <Hashtag hashtag={filter.hashtag} />
                            </div>}
                        </div>
                    ))}
                    <div className={showOptsStyle} onClick={handleToggleOptions}>Opts</div>
                </div>
            </div>
            <div className={containerStyle}>
                {showOptions && <OptionsViewer />}
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
        </div>
    );
};
