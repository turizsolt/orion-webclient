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
    headerMobileOnlyButtonStyle,
    headerSecondRowStyleMulti,
    headerDesktopOnlyButtonStyleMulti,
    headerMobileOnlyButtonStyleMulti,
    hashtagListStyleMulti,
    headerIdStyleMulti
} from './ItemViewer.style';
import { Hashtag } from '../../Hashtag';
import { Filter } from '../../../model/Filter';
import { RootState } from '../../../ReduxStore';
import { Datetag } from '../../Datetag';

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
    const { panel, hover, draggedId } = useSelector(
        (state: RootState) => state.appReducer
    );

    const { itemsMeta, options } = panel.list[panelId];
    const filters = [...panel.options.filters, ...options.filters];

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
            actions.changeItem(item.id, 'doneAt', item.originalFields.doneAt && item.originalFields.doneAt.value, new Date().toISOString());
        },
        [item, actions]
    );

    const handleMakeRejected = useCallback(
        () => {
            actions.changeItem(item.id, 'state', item.originalFields.state && item.originalFields.state.value, 'rejected');
        },
        [item, actions]
    );

    const itemColor = (item: ViewItem): string => {
        if (item.originalFields.state && item.originalFields.state.value === 'done') return '#4fc58a'; // green
        if (item.originalFields.state && item.originalFields.state.value === 'rejected') return '#eea5a6'; // red
        return item.originalFields.generated ? '#d2d3bc' : item.originalFields.template ? '#ffffff' : '#bcd2d3';
        // yellow, white and default blue
    }

    drop(ref);
    drag(dragRef);

    return (
        <div
            className={headerStyle}
            ref={ref}
            style={{
                opacity: ghost ? 0.5 : 1,
                display: !ghost && hover && draggedId === item.id ? 'none' : 'flex',
                backgroundColor: itemColor(item)
            }}
        >
            <div className={headerFirstRowStyle}>
                <StateDot symbol={item.updateness} />

                <div ref={dragRef} style={{ marginRight: '5px' }}>
                    ☰
                </div>

                {item.originalFields.due && <Datetag date={item.originalFields.due.value} />}

                <FieldViewer
                    id={item.id}
                    {...item.fields[0]}
                    params={{ noLabel: true }}
                />
                <div className={panel.list.length < 2 ? hashtagListStyle : hashtagListStyleMulti}>
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
                <div className={panel.list.length < 2 ? headerIdStyle : headerIdStyleMulti}>
                    <Link to={`/${item.id}`}>{item.id.substr(0, 6)}</Link>
                </div>
                <button className={panel.list.length < 2 ? headerDesktopOnlyButtonStyle : headerDesktopOnlyButtonStyleMulti} onClick={handleNewOpen}>
                    {'+'}
                </button>
                <button className={panel.list.length < 2 ? headerDesktopOnlyButtonStyle : headerDesktopOnlyButtonStyleMulti} onClick={handleCollapse}>
                    {collapsed ? 'V' : 'A'}
                </button>
                <button className={panel.list.length < 2 ? headerDesktopOnlyButtonStyle : headerDesktopOnlyButtonStyleMulti} onClick={handleChildrenCollapse}>
                    {childrenCollapsed ? (itemsMeta[item.id] && itemsMeta[item.id].viewedChildren.length) : '-'}
                </button>
                <button className={panel.list.length < 2 ? headerMobileOnlyButtonStyle : headerMobileOnlyButtonStyleMulti} onClick={handleMobileCollapse}>
                    {childrenCollapsed ? (itemsMeta[item.id] && itemsMeta[item.id].viewedChildren.length) : '-'}
                </button>
                <button className={headerButtonStyle} onClick={handleMakeRejected}>
                    X
                </button>
                <button className={headerButtonStyle} onClick={handleMakeDone}>
                    ✓
                </button>
            </div>
            <div className={panel.list.length < 2 ? headerSecondRowStyle : headerSecondRowStyleMulti}>
                <div className={hashtagListSecondRowStyle}>
                    {shownHashtags.map(x => (
                        <Hashtag hashtag={x} key={x.id} panelId={panelId} />
                    ))}
                </div>
            </div>
        </div>
    );
};
