import React, { useContext, useRef, RefObject, useCallback } from 'react';
import { HashtagInfo, ViewItem } from '../../../model/Item/ViewItem';
import { ActionsContext } from '../../../App';
import { Actions } from '../../../LocalStore/Actions';
import { ItemId } from '../../../model/Item/ItemId';
import { useSelector } from 'react-redux';
import { FieldViewer } from '../FieldViewer';
import { StateDot } from '../StateDot';
import { Link } from 'react-router-dom';
import { useItemDnD } from '../useItemDnD';
import {
    headerStyle,
    headerButtonStyle,
    hashtagListStyle,
    responsibleCircleStyle,
    headerFirstRowStyle,
    headerSecondRowStyle,
    hashtagListSecondRowStyle,
    headerIdStyle,
    headerDesktopOnlyButtonStyle,
    headerMobileOnlyButtonStyle
} from './ItemViewer.style';
import { Hashtag } from '../../Hashtag';
import { Filter } from '../../../model/Filter';
import { RootState } from '../../../ReduxStore';

export interface Props {
    item: ViewItem;
    parentId: ItemId | null;
    path: string;
    ghost?: boolean;
    handleNewOpen: () => void;
    handleCollapse: () => void;
    handleChildrenCollapse: () => void;
    collapsed: boolean;
    childrenCollapsed: boolean;
    panelId: number;
}

export const ItemViewerHeader: React.FC<Props> = props => {
    const ref: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
    const dragRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

    const {
        item,
        ghost,
        childrenCollapsed,
        collapsed,
        handleNewOpen,
        handleCollapse,
        handleChildrenCollapse,
        panelId
    } = props;
    const { panelList, hover, draggedId } = useSelector(
        (state: RootState) => state.appReducer
    );

    const {itemsMeta, options} = panelList[panelId];
    const { filters } = options;

    const handleMobileCollapse = useCallback(() => {
        handleCollapse();
        handleChildrenCollapse();
    }, [handleCollapse, handleChildrenCollapse]);

    // remove the hashtags that are alredy filtered
    const hashtagIds: ItemId[] = filters
        .filter((filter: Filter) => filter.hashtag)
        .map((filter: Filter) => (filter.hashtag && filter.hashtag.id) as string);
    const shownHashtags = item.hashtags.filter((h: HashtagInfo) => !hashtagIds.includes(h.id));

    const actions: Actions = useContext(ActionsContext);

    const [drag, drop] = useItemDnD(props, actions, childrenCollapsed);

    const handleMakeDone = useCallback(
        () => {
            actions.changeItem(item.id, 'state', item.originalFields.state && item.originalFields.state.value, 'done');
        },
        [item, actions]
    );

    drop(ref);
    drag(dragRef);

    return (
        <div
            className={headerStyle}
            ref={ref}
            style={{
                opacity: ghost ? 0.5 : 1,
                display: !ghost && hover && draggedId === item.id ? 'none' : 'flex',
                backgroundColor: item.originalFields.generated ? '#d2d3bc' : item.originalFields.template ? '#d2bcd3' : '#bcd2d3'
            }}
        >
            <div className={headerFirstRowStyle}>
                <StateDot symbol={item.updateness} />

                <div ref={dragRef} style={{ marginRight: '5px' }}>
                    ☰
                </div>

                <FieldViewer
                    id={item.id}
                    {...item.fields[0]}
                    params={{ noLabel: true }}
                />
                <div className={hashtagListStyle}>
                    {shownHashtags.map(x => (
                        <Hashtag hashtag={x} key={x.id} panelId={panelId} />
                    ))}
                </div>
                <div style={{ display: 'flex' }}>
                    {item.responsibles.map(responsible => (
                        <div key={responsible.id} className={responsibleCircleStyle}>
                            {responsible.username[0].toUpperCase()}
                        </div>
                    ))}
                </div>
                <div className={headerIdStyle}>
                    <Link to={`/${item.id}`}>{item.id.substr(0, 6)}</Link>
                </div>
                <button className={headerDesktopOnlyButtonStyle} onClick={handleNewOpen}>
                    {'+'}
                </button>
                <button className={headerDesktopOnlyButtonStyle} onClick={handleCollapse}>
                    {collapsed ? 'V' : 'A'}
                </button>
                <button className={headerDesktopOnlyButtonStyle} onClick={handleChildrenCollapse}>
                    {childrenCollapsed ? (itemsMeta[item.id] && itemsMeta[item.id].viewedChildren.length) : '-'}
                </button>
                <button className={headerMobileOnlyButtonStyle} onClick={handleMobileCollapse}>
                    {childrenCollapsed ? (itemsMeta[item.id] && itemsMeta[item.id].viewedChildren.length) : '-'}
                </button>
                <button className={headerButtonStyle} onClick={handleMakeDone}>
                    ✓
                </button>
            </div>
            <div className={headerSecondRowStyle}>
                <div className={hashtagListSecondRowStyle}>
                    {shownHashtags.map(x => (
                        <Hashtag hashtag={x} key={x.id} panelId={panelId} />
                    ))}
                </div>
            </div>
        </div>
    );
};
