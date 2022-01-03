import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ItemViewer } from './ItemViewer/ItemViewer';
import { ItemId } from '../../model/Item/ItemId';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { ItemAdderViewer } from './ItemAdderViewer';
import { media, style } from 'typestyle';
import { OptionsViewer } from './OptionsViewer';
import { HashtagInfo } from '../../model/Item/ViewItem';
import { Hashtag } from '../Hashtag';
import { hashtagRibbonStyle, omitMobile } from './ItemViewer/ItemViewer.style';
import { Filter } from '../../model/Filter';
import { ConnectionChecker } from './ConnectionChecker';
import { RootState } from '../../ReduxStore';
import { Panel } from '../../ReduxStore/reducer';
import { Actions } from '../../LocalStore/Actions';
import { ActionsContext } from '../../App';
import { NavLink } from 'react-router-dom';
import { InvertedHashtag } from '../InvertedHashtag';
import { CalendarGenerator } from './CalendarGenerator';

const panelContainerStyle = style(
    {
        display: 'flex',
        width: '100%'
    }
);

const panelContainerStyleSixPlus = style(
    {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
        width: '100%'
    }
);

const panelStyle = style(
    {
        flexBasis: '100%'
    }
);

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

const containerStyleMulti = style(
    {
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
    }
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
    const { id: panelConfigName } = useParams<{ id: ItemId }>();

    const actions: Actions = useContext(ActionsContext);

    useEffect(() => {
        actions.initPanels(panelConfigName);
    }, [panelConfigName, actions]);

    const { items, itemList, panel, panelNames } = useSelector(
        (state: RootState) => state.appReducer
    );

    const [showChildrenAdder, setShowChildrenAdder] = useState(-1);
    const [showHashtagAdder, setShowHashtagAdder] = useState(-1);

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

    const handleNew = useCallback((panelId: number) => () => {
        setShowChildrenAdder(panelId);
    }, []);

    const handleHashtagAdder = useCallback((panelId: number) => () => {
        setShowHashtagAdder(showHashtagAdder === panelId ? -1 : panelId);
    }, [showHashtagAdder]);

    const handleNewClose = useCallback(() => {
        setShowChildrenAdder(-1);
    }, []);

    const [showOptions, setShowOptions] = useState(false);
    const handleToggleOptions = useCallback(() => {
        setShowOptions(!showOptions);
    }, [showOptions]);

    return (
        <div>
            <div><i>Version 2022.01.03.2</i>
                <span className={omitMobile}>
                    PanelConfigId: {panelConfigName},
                    All configs:
                    {panelNames.map(panelName => <NavLink key={panelName} to={'/panels/' + panelName}>{panelName}</NavLink>)}
                </span>
            </div>
            <ConnectionChecker />
            <div className={omitMobile}>
                <CalendarGenerator />
                <hr />
                Global:
                <div className={hashtagRibbonStyle}>
                    {panel.options.filters.map((filter: Filter) => (
                        <div key={filter.id}>
                            {filter.hashtag && filter.rule.name === 'hashtag' && <div className={optionsHashOuter}>
                                <Hashtag hashtag={filter.hashtag} panelId={-1} />
                            </div>}
                            {filter.hashtag && filter.rule.name === 'notHashtag' && <div className={optionsHashOuter}>
                                <InvertedHashtag hashtag={filter.hashtag} panelId={-1} />
                            </div>}
                        </div>
                    ))}
                </div>
                <hr />
                <div className={hashtagRibbonStyle}>
                    {hashtagItemIds
                        .map(id =>
                            <Hashtag hashtag={idToHashtagInfo(id)} key={id} panelId={-1} />
                        )}
                </div>
            </div>
            <div className={containerStyleMulti}>
                {showOptions && <OptionsViewer panelId={-1} />}
            </div>
            <hr />
            {showHashtagAdder !== -1 && <>
                Panel based:
                <div className={hashtagRibbonStyle}>
                    {hashtagItemIds
                        .map(id =>
                            <Hashtag hashtag={idToHashtagInfo(id)} key={id} panelId={showHashtagAdder} />
                        )}
                </div>
                <button onClick={handleHashtagAdder(-1)}>#close</button>
                <hr />
            </>}
            <div className={panel.list.length < 7 ? panelContainerStyle : panelContainerStyleSixPlus}>
                {panel.list.map((xpanel: Panel, panelId: number) => <div key={panelId} className={panelStyle}>
                    <div>
                        <div className={hashtagRibbonStyle}>
                            {xpanel.options.filters.map((filter: Filter) => (
                                <div key={filter.id}>
                                    {filter.hashtag && filter.rule.name === 'hashtag' && <div className={optionsHashOuter}>
                                        <Hashtag hashtag={filter.hashtag} panelId={panelId} />
                                    </div>}
                                    {filter.hashtag && filter.rule.name === 'notHashtag' && <div className={optionsHashOuter}>
                                        <InvertedHashtag hashtag={filter.hashtag} panelId={panelId} />
                                    </div>}
                                </div>
                            ))}
                            <button onClick={handleHashtagAdder(panelId)}>{showHashtagAdder === panelId ? '#close' : '#add'}</button>
                            <div className={showOptsStyle} onClick={handleToggleOptions}>Opts</div>
                        </div>
                    </div>
                    <div className={panel.list.length < 2 ? containerStyle : containerStyleMulti}>
                        {showOptions && <OptionsViewer panelId={panelId} />}

                        <div className={mainStyle}>
                            {xpanel.viewedItemList.map((id: ItemId) => (
                                <ItemViewer key={id} item={items[id]} parentId={null} path={''} panelId={panelId} />
                            ))}
                            {showChildrenAdder === panelId && (
                                <ItemAdderViewer parentId={undefined} onClose={handleNewClose} panelId={panelId} />
                            )}
                            {!panel.list[panelId].options.disableAdding && <button onClick={handleNew(panelId)}>Add</button>}
                        </div>

                    </div>
                </div>)}
            </div>
        </div>
    );
};
