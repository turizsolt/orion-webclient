import React, { useContext, useRef, RefObject, useCallback } from 'react';
import { ViewItem } from '../../../model/Item/ViewItem';
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
    hashtagListSecondRowStyle
} from './ItemViewer.style';
import { Hashtag } from '../../Hashtag';

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
        handleChildrenCollapse
    } = props;
    const { itemsMeta, hover, draggedId } = useSelector(
        (state: any) => state.appReducer
    );
    const actions: Actions = useContext(ActionsContext);

    const [drag, drop] = useItemDnD(props, actions, childrenCollapsed);

    const handleMakeDone = useCallback(
        () => {
            actions.changeItem(item.id, 'state', item.originalFields.state && item.originalFields.state.value, 'done');
        },
        [item, actions]
    );

    const handleShallowCopy = useCallback(
        () => {
            actions.shallowCopy(item.id);
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
                backgroundColor: item.originalFields.template ? '#d2bcd3' : '#bcd2d3'
            }}
        >
            <div className={headerFirstRowStyle}>
                <StateDot symbol={item.updateness} />

                <div ref={dragRef} style={{ marginLeft: '5px', marginRight: '5px' }}>
                    ☰
                </div>

                <FieldViewer
                    id={item.id}
                    {...item.fields[0]}
                    params={{ noLabel: true }}
                />
                <div className={hashtagListStyle}>
                    {item.hashtags.map(x => (
                        <Hashtag hashtag={x} key={x.id} />
                    ))}
                </div>
                <div style={{ display: 'flex' }}>
                    {item.responsibles.map(responsible => (
                        <div key={responsible.id} className={responsibleCircleStyle}>
                            {responsible.username[0].toUpperCase()}
                        </div>
                    ))}
                </div>
                <div>
                    <Link to={`/${item.id}`}>{item.id.substr(0, 6)}</Link>
                </div>
                <button className={headerButtonStyle} onClick={handleNewOpen}>
                    {'+'}
                </button>
                <button className={headerButtonStyle} onClick={handleCollapse}>
                    {collapsed ? 'V' : 'A'}
                </button>
                <button className={headerButtonStyle} onClick={handleChildrenCollapse}>
                    {childrenCollapsed ? itemsMeta[item.id].viewedChildren.length : '-'}
                </button>
                <button className={headerButtonStyle} onClick={handleMakeDone}>
                    Done
                </button>
                <button className={headerButtonStyle} onClick={handleShallowCopy}>
                    SCopy
                </button>
            </div>
            <div className={headerSecondRowStyle}>
                <div className={hashtagListSecondRowStyle}>
                    {item.hashtags.map(x => (
                        <Hashtag hashtag={x} key={x.id} />
                    ))}
                </div>
            </div>
        </div>
    );
};
