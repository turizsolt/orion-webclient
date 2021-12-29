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
import { RootState } from '../../../ReduxStore';

export interface ItemViewerProps {
  item: ViewItem;
  parentId: ItemId | null;
  path: string;
  ghost?: boolean;
  panelId: number;
}

export const ItemViewer: React.FC<ItemViewerProps> = props => {
  const { item, path, ghost, panelId } = props;
  const myPath = path + (path ? '_' : '') + item.id;
  const { items, panelList, hover, draggedId } = useSelector(
    (state: RootState) => state.appReducer
  );

  const {itemsMeta} = panelList[panelId];

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
          <ItemViewer item={items[draggedId as string]} parentId={null} path={''} ghost panelId={panelId} />
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
                  panelId={panelId}
                />
              ))}
            {!childrenCollapsed && item.templates.map(template => (
              <ItemViewer
                key={template.id}
                item={items[template.id]}
                parentId={null}
                path={myPath}
                ghost={ghost}
                panelId={panelId}
              />
            ))}
            {!childrenCollapsed && item.generateds.map(generated => (
              <ItemViewer
                key={generated.id}
                item={items[generated.id]}
                parentId={null}
                path={myPath}
                ghost={ghost}
                panelId={panelId}
              />
            ))}
            {showChildrenAdder && (
              <ItemAdderViewer parentId={item.id} panelId={panelId} onClose={handleNewClose} />
            )}
          </div>
          {hoverPlaceholder('after')}
        </>
      )}
    </>
  );
};
