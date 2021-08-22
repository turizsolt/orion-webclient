import React from 'react';
import { ViewItem } from '../../../model/Item/ViewItem';
import { ItemId } from '../../../model/Item/ItemId';
import { useSelector } from 'react-redux';
import { ItemAdderViewer } from '../ItemAdderViewer';
import {
  itemStyle,
  childrenStyle,
  childrenStyleDynamic
} from './ItemViewer.style';
import { ItemViewerHeader } from './ItemViewerHeader';
import { ItemViewerDetails } from './ItemViewerDetails';
import { useToggle } from '../useToggle';

export interface ItemViewerProps {
  item: ViewItem;
  parentId: ItemId | null;
  path: string;
  ghost?: boolean;
}

export const ItemViewer: React.FC<ItemViewerProps> = props => {
  const { item, path, ghost } = props;
  const myPath = path + (path ? '_' : '') + item.id;
  const { items, itemsMeta, hover, draggedId } = useSelector(
    (state: any) => state.appReducer
  );

  const { isOpen: collapsed, toggle: handleCollapse } = useToggle(true);
  const {
    isOpen: childrenCollapsed,
    toggle: handleChildrenCollapse
  } = useToggle(true);
  const {
    isOpen: showChildrenAdder,
    open: handleNewOpen,
    close: handleNewClose
  } = useToggle(false);

  const toggles = {
    handleNewOpen,
    handleCollapse,
    handleChildrenCollapse,
    childrenCollapsed,
    collapsed
  };

  const isHover = (place: string): boolean => {
    return !ghost && hover && hover.path === myPath && hover.place === place;
  };

  const hoverPlaceholder = (place: string): JSX.Element => {
    return (
      <>
        {isHover(place) && (
          <ItemViewer item={items[draggedId]} parentId={null} path={''} ghost />
        )}
      </>
    );
  };

  return (
    <>
      {item && (
        <>
          {hoverPlaceholder('before')}
          <div className={itemStyle}>
            <ItemViewerHeader {...props} {...toggles} />
            {!collapsed && (
              <ItemViewerDetails {...props} {...{ handleNewOpen }} />
            )}
          </div>
          <div
            className={childrenStyle}
            style={childrenStyleDynamic(draggedId === item.id)}
          >
            {hoverPlaceholder('child')}
            {!childrenCollapsed &&
              itemsMeta[item.id].viewedChildren.map((child: ItemId) => (
                <ItemViewer
                  key={child}
                  item={items[child]}
                  parentId={item.id}
                  path={myPath}
                  ghost={ghost}
                />
              ))}
            {item.templates.map(template => (
              <ItemViewer
                key={template.id}
                item={items[template.id]}
                parentId={null}
                path={myPath}
                ghost={ghost}
              />
            ))}
            {showChildrenAdder && (
              <ItemAdderViewer parentId={item.id} hashtagId={undefined} onClose={handleNewClose} />
            )}
          </div>
          {hoverPlaceholder('after')}
        </>
      )}
    </>
  );
};
