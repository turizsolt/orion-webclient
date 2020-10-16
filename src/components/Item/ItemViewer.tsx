import React, {
  useCallback,
  useContext,
  useState,
  FormEvent,
  useRef,
  RefObject
} from 'react';
import { ViewItem } from '../../model/Item/ViewItem';
import { ActionsContext, ItemTypes } from '../../App';
import { Actions } from '../../LocalStore/Actions';
import { ItemId } from '../../model/Item/ItemId';
import { RelationType } from '../../model/Relation/RelationType';
import { useSelector } from 'react-redux';
import { FieldViewer } from './FieldViewer';
import { style } from 'typestyle';
import { StateDot } from './StateDot';
import { Link } from 'react-router-dom';
import { ItemAdderViewer } from './ItemAdderViewer';
import { FieldTypeOf, fieldTypeList } from '../../model/Item/FieldTypeOf';
import {
  useDrag,
  DragSourceMonitor,
  useDrop,
  DropTargetMonitor,
  XYCoord
} from 'react-dnd';

interface Props {
  item: ViewItem;
  parentId: ItemId | null;
  path: string;
  ghost?: boolean;
}

const itemStyle = style({
  borderRadius: '20px',
  backgroundColor: '#87b6b8',
  marginBottom: '5px'
});

const headerStyle = style({
  padding: '5px',
  borderRadius: '20px',
  backgroundColor: '#bcd2d3',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '18px'
});

const childrenStyle = style({
  marginLeft: '20px',
  marginBottom: '5px'
});

const propsStyle = style({
  padding: '5px',
  fontSize: '14px'
});

const headerButtonStyle = style({
  marginLeft: '5px'
});

export const ItemViewer: React.FC<Props> = props => {
  const ref: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  const { item, parentId, path, ghost } = props;
  const myPath = path + (path ? '_' : '') + item.id;
  const { items, itemsMeta, itemList, hover, draggedId } = useSelector(
    (state: any) => state.appReducer
  );
  const actions: Actions = useContext(ActionsContext);

  const [collapsed, setCollapsed] = useState(true);
  const [childrenCollapsed, setChildrenCollapsed] = useState(true);

  const handleDetachFromParent = useCallback(
    (id: ItemId) => (_: any) => {
      if (item.parents.length === 0) return;
      const parentId = item.parents[0];
      actions.removeRelation(id, RelationType.Parent, parentId);
    },
    [actions, item]
  );

  const handleCollapse = useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed]);

  const handleChildrenCollapse = useCallback(() => {
    setChildrenCollapsed(!childrenCollapsed);
  }, [childrenCollapsed]);

  const handleAddField = useCallback(
    (event: FormEvent<HTMLSelectElement>) => {
      const field = event.currentTarget.value;
      actions.changeItem(
        item.id,
        field,
        undefined,
        FieldTypeOf(field).getDefaultValue()
      );
      event.currentTarget.value = '';
    },
    [item, actions]
  );

  const [showChildrenAdder, setShowChildrenAdder] = useState(false);

  const handleNew = useCallback(() => {
    setShowChildrenAdder(true);
  }, []);

  const handleNewClose = useCallback(() => {
    setShowChildrenAdder(false);
  }, []);

  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.ITEM, id: item.id, parentId, x: 0 },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: !!monitor.isDragging()
    }),
    begin: (monitor: DragSourceMonitor) => {
      actions.dragged(item.id);

      if (ref) {
        const hoverBoundingRect =
          ref.current && ref.current.getBoundingClientRect();

        const clientOffset = monitor.getClientOffset() || { y: 0, x: 0 };

        const hoverClientX =
          (clientOffset as XYCoord).x -
          (hoverBoundingRect ? hoverBoundingRect.left : 0);

        return { type: ItemTypes.ITEM, id: item.id, parentId, x: hoverClientX };
      }
    },
    end: () => {
      actions.hover(null);
      actions.dragged(null);
    }
  });

  const x = (c: string) => {
    if (!items[c]) {
      return 0;
    }
    if (!items[c].originalFields) {
      return 0;
    }
    if (!items[c].originalFields.priority) {
      return 0;
    }
    if (!items[c].originalFields.priority.value) {
      return 0;
    }
    return parseInt(items[c].originalFields.priority.value, 10);
  };

  const drop = useDrop({
    accept: ItemTypes.ITEM,
    drop: (dragged: any, monitor: DropTargetMonitor) => {
      if (dragged.id === hover.id) return;

      let newPrio = 0;

      // todo majd modositani
      if (hover.place === 'after') {
        let max = 0;
        const children = hover.parentId
          ? items[hover.parentId].children
          : itemList.filter((id: string) => items[id].parents.length === 0);

        for (let i = 0; i < children.length; i++) {
          const id = children[i];
          if (x(id) >= x(item.id)) {
            continue;
          }
          if (x(id) > max) {
            max = x(id);
          }
        }
        newPrio = Math.round((x(item.id) + max) / 2);
      } else {
        let min = Math.pow(2, 31) - 1;

        const children = hover.parentId
          ? items[hover.parentId].children
          : itemList.filter((id: string) => items[id].parents.length === 0);

        for (let i = 0; i < children.length; i++) {
          const id = children[i];
          if (x(id) <= x(item.id)) {
            continue;
          }
          if (x(id) < min) {
            min = x(id);
          }
        }
        newPrio = Math.round((x(item.id) + min) / 2);
      }

      actions.changeItem(
        dragged.id,
        'priority',
        items[dragged.id].originalFields.priority &&
          items[dragged.id].originalFields.priority.value,
        newPrio
      );

      if (dragged.parentId !== hover.parentId) {
        if (dragged.parentId) {
          actions.removeRelation(
            dragged.id,
            RelationType.Parent,
            dragged.parentId
          );
        }
        if (hover.parentId) {
          actions.addRelation(dragged.id, RelationType.Parent, hover.parentId);
        }
      }
    },
    hover: (dragged: any, monitor: DropTargetMonitor) => {
      if (!monitor.isOver()) return;

      if (ref) {
        const hoverBoundingRect =
          ref.current && ref.current.getBoundingClientRect();

        const hoverMiddleY = hoverBoundingRect
          ? (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
          : 0;

        const clientOffset = monitor.getClientOffset() || { y: 0 };

        const hoverClientY =
          (clientOffset as XYCoord).y -
          (hoverBoundingRect ? hoverBoundingRect.top : 0);

        const hoverClientX =
          (clientOffset as XYCoord).x -
          (hoverBoundingRect ? hoverBoundingRect.left : 0);

        const sameId = item.id === dragged.id;
        const isUpper = hoverClientY < hoverMiddleY;
        const isChild = hoverClientX - dragged.x > 20;
        const isOpen =
          !childrenCollapsed && itemsMeta[item.id].viewedChildren.length > 0;

        const newHover = {
          path: sameId ? hover.path : myPath,
          place: isUpper ? 'before' : isOpen || isChild ? 'child' : 'after',
          id: item.id,
          parentId
        };

        if (
          !hover ||
          hover.path !== newHover.path ||
          hover.place !== newHover.place
        ) {
          actions.hover(newHover);
        }
      }
    }
  })[1];

  drag(drop(ref));

  return (
    <>
      {item && (
        <>
          {hover && hover.path === myPath && hover.place === 'before' && (
            <ItemViewer
              item={items[draggedId]}
              parentId={null}
              path={''}
              ghost
            />
          )}
          <div className={itemStyle}>
            <div
              className={headerStyle}
              ref={ref}
              style={{
                opacity: ghost ? 0.5 : 1,
                display: isDragging ? 'none' : 'flex'
              }}
            >
              <StateDot symbol={item.updateness} />
              <FieldViewer
                id={item.id}
                {...item.fields[0]}
                params={{ noLabel: true }}
              />
              <div>
                [
                {item.originalFields.priority &&
                  item.originalFields.priority.value}
                ] &nbsp;
              </div>
              <div>
                <Link to={`/${item.id}`}>{item.id.substr(0, 6)}</Link>
              </div>
              <button className={headerButtonStyle} onClick={handleNew}>
                {'+'}
              </button>
              <button className={headerButtonStyle} onClick={handleCollapse}>
                {collapsed ? 'V' : 'A'}
              </button>
              <button
                className={headerButtonStyle}
                onClick={handleChildrenCollapse}
              >
                {childrenCollapsed
                  ? itemsMeta[item.id].viewedChildren.length
                  : '-'}
              </button>
            </div>
            {!collapsed && (
              <div className={propsStyle}>
                {item.fields.map(field => (
                  <div key={field.name}>
                    <FieldViewer id={item.id} {...field} />
                    {field.auxilaryValues.map((value, index) => (
                      <div key={index}>
                        {value
                          ? `${item.auxilaryColumns[index]}: ${value}`
                          : ''}
                      </div>
                    ))}
                  </div>
                ))}
                <select onChange={handleAddField}>
                  <option value="">Add field</option>
                  {fieldTypeList.map(fieldType => (
                    <option value={fieldType.name} key={fieldType.name}>
                      {fieldType.name} ({fieldType.type})
                    </option>
                  ))}
                </select>
                <button onClick={handleNew}>+ Add child</button>
                <button onClick={handleDetachFromParent(item.id)}>
                  - Detach first parent
                </button>
              </div>
            )}
          </div>
          <div
            className={childrenStyle}
            style={{
              display: isDragging ? 'none' : 'block'
            }}
          >
            {hover && hover.path === myPath && hover.place === 'child' && (
              <ItemViewer
                item={items[draggedId]}
                parentId={null}
                path={''}
                ghost
              />
            )}
            {!childrenCollapsed &&
              itemsMeta[item.id].viewedChildren.map(
                (child: ItemId, index: number) => (
                  <ItemViewer
                    key={child}
                    item={items[child]}
                    parentId={item.id}
                    path={myPath}
                    ghost={ghost}
                  />
                )
              )}
            {showChildrenAdder && (
              <ItemAdderViewer parentId={item.id} onClose={handleNewClose} />
            )}
          </div>
          {hover && hover.path === myPath && hover.place === 'after' && (
            <ItemViewer
              item={items[draggedId]}
              parentId={null}
              path={''}
              ghost
            />
          )}
        </>
      )}
    </>
  );
};
