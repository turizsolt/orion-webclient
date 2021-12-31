import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ItemViewer } from './ItemViewer/ItemViewer';
import { ItemId } from '../../model/Item/ItemId';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { ItemAdderViewer } from './ItemAdderViewer';
import { style, media } from 'typestyle';
import { OptionsViewer } from './OptionsViewer';
import { HashtagInfo } from '../../model/Item/ViewItem';
import { Hashtag } from '../Hashtag';
import { hashtagRibbonStyle } from './ItemViewer/ItemViewer.style';
import { Filter } from '../../model/Filter';
import { ConnectionChecker } from './ConnectionChecker';
import { RootState } from '../../ReduxStore';
import { Panel } from '../../ReduxStore/reducer';
import { Actions } from '../../LocalStore/Actions';
import { ActionsContext } from '../../App';
import { NavLink } from 'react-router-dom';

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
    const { id: panelConfigName } = useParams<{id:ItemId}>();

    const actions: Actions = useContext(ActionsContext);

    useEffect(() => {
        actions.initPanels(panelConfigName);
    }, [panelConfigName, actions]);

    const { items, itemList, panelList, panelNames } = useSelector(
        (state: RootState) => state.appReducer
    );
    
    const [showChildrenAdder, setShowChildrenAdder] = useState(-1);

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

    const handleNewClose = useCallback(() => {
        setShowChildrenAdder(-1);
    }, []);

    const [showOptions, setShowOptions] = useState(false);
    const handleToggleOptions = useCallback(() => {
        setShowOptions(!showOptions);
    }, [showOptions]);

    const showAllHashtags = (panel:Panel) => !panel.options.filters.some((filter: Filter) => filter.hashtag);

    return (
        <div>
            <div><i>Version 2021.12.15.2</i> PanelConfigId: {panelConfigName},
            All configs:
                {panelNames.map(panelName => <NavLink key={panelName} to={'/panels/'+panelName}>{panelName}</NavLink>)}
            </div>
            <ConnectionChecker />  
            <div style={{display:'flex'}}>
                {panelList.map((panel:Panel, panelId: number) => <div key={panelId}>
                    <div>
                        {showAllHashtags(panel) && <>
                            <div className={hashtagRibbonStyle}>
                                {hashtagItemIds
                                    .map(id =>
                                        <Hashtag hashtag={idToHashtagInfo(id)} key={id} panelId={panelId} />
                                    )}
                            </div>
                            <hr />
                        </>}
                        <div className={hashtagRibbonStyle}>
                            {panel.options.filters.map((filter: Filter) => (
                                <div key={filter.id}>
                                    {filter.hashtag && <div className={optionsHashOuter}>
                                        <Hashtag hashtag={filter.hashtag} panelId={panelId} />
                                    </div>}
                                </div>
                            ))}
                            <div className={showOptsStyle} onClick={handleToggleOptions}>Opts</div>
                        </div>
                    </div>
                    <div className={containerStyle}>
                        {showOptions && <OptionsViewer panelId={panelId} />}
                        
                        <div className={mainStyle}>
                            {panel.viewedItemList.map((id: ItemId) => (
                                <ItemViewer key={id} item={items[id]} parentId={null} path={''} panelId={panelId} />
                            ))}
                            {showChildrenAdder === panelId && (
                                <ItemAdderViewer parentId={undefined} onClose={handleNewClose} panelId={panelId} />
                            )}
                            <button onClick={handleNew(panelId)}>Add</button>
                        </div>
                    
                    </div>
                </div>)}
            </div>
        </div>
    );
};
