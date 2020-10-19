import React, { useContext, useRef, RefObject } from 'react';
import { ViewItem } from '../../../model/Item/ViewItem';
import { ActionsContext } from '../../../App';
import { Actions } from '../../../LocalStore/Actions';
import { ItemId } from '../../../model/Item/ItemId';
import { useSelector } from 'react-redux';
import { FieldViewer } from '../FieldViewer';
import { StateDot } from '../StateDot';
import { Link } from 'react-router-dom';
import { useItemDnD } from '../useItemDnD';
import { headerStyle, headerButtonStyle } from './ItemViewer.style';

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

  drag(drop(ref));

  return (
    <div
      className={headerStyle}
      ref={ref}
      style={{
        opacity: ghost ? 0.5 : 1,
        display: !ghost && hover && draggedId === item.id ? 'none' : 'flex'
      }}
    >
      <StateDot symbol={item.updateness} />
      <FieldViewer
        id={item.id}
        {...item.fields[0]}
        params={{ noLabel: true }}
      />
      <div>
        {item.hashtags.map(x => (
          <span style={{ color: x.color }} key={x.hashtag}>
            #{x.hashtag}
          </span>
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
    </div>
  );
};
