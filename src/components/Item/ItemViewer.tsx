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
  DropTargetMonitor
} from 'react-dnd';
import {
  common,
  getPriority,
  fillInPrioritiesOfAParent
} from '../../ReduxStore/commons';

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
  const { items, itemsMeta, viewedItemList, hover, draggedId } = useSelector(
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
    item: { type: ItemTypes.ITEM, id: item.id, parentId },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: !!monitor.isDragging()
    }),
    begin: (monitor: DragSourceMonitor) => {
      const family: ItemId[] = parentId
        ? itemsMeta[parentId].viewedChildren
        : viewedItemList;

      const myPos = family.findIndex(x => x === item.id);
      setTimeout(() => {
        actions.dragged(item.id);

        if (myPos === 0) {
          if (parentId) {
            actions.hover({
              path: path,
              place: 'child',
              id: parentId,
              parentId
            });
          } else {
            actions.hover({
              path: family[1],
              place: 'before',
              id: family[1],
              parentId
            });
          }
        } else {
          const prevPath = path + (path ? '_' : '') + family[myPos - 1];
          actions.hover({
            path: prevPath,
            place: 'after',
            id: family[myPos - 1],
            parentId
          });
        }
      }, 0);
    },
    canDrag: () => {
      const family: ItemId[] = parentId ? [] : viewedItemList;
      if (!parentId && family.length < 2) {
        return false;
      }
      return true;
    },
    end: () => {
      actions.hover(null);
      actions.dragged(null);
    }
  });

  const drop = useDrop({
    accept: ItemTypes.ITEM,
    drop: (dragged: any, monitor: DropTargetMonitor) => {
      if (hover.id === draggedId) return;

      const parent = hover.place === 'child' ? hover.id : hover.parentId;

      fillInPrioritiesOfAParent(
        parent,
        itemsMeta,
        viewedItemList,
        items,
        actions
      );

      if (parent !== dragged.parentId) {
        if (dragged.parentId) {
          actions.removeRelation(
            dragged.id,
            RelationType.Parent,
            dragged.parentId
          );
        }
        if (parent) {
          actions.addRelation(dragged.id, RelationType.Parent, parent);
        }
      }
      const family: ItemId[] = parent
        ? itemsMeta[parent].viewedChildren
        : viewedItemList;

      const hoverPos = family.findIndex(x => x === hover.id);

      let newPriority = 0;
      if (hover.place === 'child') {
        newPriority = Math.round(getPriority(family[0], items) / 2);
      }

      if (hover.place === 'before') {
        if (hoverPos === 0) {
          newPriority = Math.round(getPriority(family[0], items) / 2);
        } else {
          newPriority = Math.round(
            (getPriority(family[hoverPos - 1], items) +
              getPriority(family[hoverPos], items)) /
              2
          );
        }
      }

      if (hover.place === 'after') {
        if (hoverPos === family.length - 1) {
          newPriority = Math.round(
            getPriority(family[family.length - 1], items) + Math.pow(2, 20)
          );
        } else {
          newPriority = Math.round(
            (getPriority(family[hoverPos + 1], items) +
              getPriority(family[hoverPos], items)) /
              2
          );
        }
      }

      actions.changeItem(
        dragged.id,
        'priority',
        getPriority(dragged.id, items),
        newPriority
      );
    },
    hover: (dragged: any, monitor: DropTargetMonitor) => {
      if (ghost) return;

      if (parentId === hover.parentId) {
        const family: ItemId[] = parentId
          ? itemsMeta[parentId].viewedChildren
          : viewedItemList;

        const hoverPos =
          family.findIndex(x => x === hover.id) -
          (hover.place === 'before' ? 1 : 0);
        const myPos = family.findIndex(x => x === item.id);

        if (hoverPos >= myPos) {
          // felfele
          // legelso eset
          if (myPos === 0) {
            if (parentId) {
              actions.hover({
                path: path,
                place: 'child',
                id: parentId,
                parentId
              });
            } else {
              actions.hover({
                path: family[0],
                place: 'before',
                id: family[0],
                parentId
              });
            }
          } else {
            // felfele altalanos
            const prevPath = path + (path ? '_' : '') + family[myPos - 1];
            actions.hover({
              path: prevPath,
              place: 'after',
              id: family[myPos - 1],
              parentId
            });
          }
        } else {
          // lefele
          if (!childrenCollapsed && itemsMeta[item.id].viewedChildren.length) {
            // gyereknek
            actions.hover({
              path: myPath,
              place: 'child',
              id: item.id,
              parentId
            });
          } else {
            // moge
            // [todo itt el lehetne donteni, hogy melyik lesz]
            actions.hover({
              path: myPath,
              place: 'after',
              id: item.id,
              parentId
            });
          }
        }
      } else {
        let felfele: boolean = false;

        const [commonPath, lastCommon, hoverNext, myNext] = common(
          hover.path,
          myPath
        );
        if (!hoverNext && !myNext) {
          // todo meg nem ertem
          felfele = true;
        }
        if (!hoverNext) {
          // hover van feljebb
          if (hover.place === 'after') {
            felfele = true;
          } else {
            felfele = false;
          }
        } else if (!myNext) {
          // en vagyok feljebb - ez az eset nem fordulhat elo
          felfele = true;
        } else {
          const family: ItemId[] = commonPath
            ? itemsMeta[lastCommon].viewedChildren
            : viewedItemList;

          const hoverPos = family.findIndex(x => x === hoverNext);
          const myPos = family.findIndex(x => x === myNext);

          if (hoverPos > myPos) {
            felfele = true;
          } else {
            felfele = false;
          }
        }

        /////////////////////////////////////////////

        const family: ItemId[] = parentId
          ? itemsMeta[parentId].viewedChildren
          : viewedItemList;

        const myPos = family.findIndex(x => x === item.id);
        if (felfele) {
          // felfele
          // legelso eset
          if (myPos === 0) {
            if (parentId) {
              actions.hover({
                path: path,
                place: 'child',
                id: parentId,
                parentId
              });
            } else {
              actions.hover({
                path: family[0],
                place: 'before',
                id: family[0],
                parentId
              });
            }
          } else {
            // felfele altalanos
            const prevPath = path + (path ? '_' : '') + family[myPos - 1];
            actions.hover({
              path: prevPath,
              place: 'after',
              id: family[myPos - 1],
              parentId
            });
          }
        } else {
          // lefele
          if (!childrenCollapsed && itemsMeta[item.id].viewedChildren.length) {
            // gyereknek
            actions.hover({
              path: myPath,
              place: 'child',
              id: item.id,
              parentId
            });
          } else {
            // moge
            // [todo itt el lehetne donteni, hogy melyik lesz]
            actions.hover({
              path: myPath,
              place: 'after',
              id: item.id,
              parentId
            });
          }
        }
      }
    }
  })[1];

  drag(drop(ref));

  return (
    <>
      {item && (
        <>
          {!ghost &&
            hover &&
            hover.path === myPath &&
            hover.place === 'before' && (
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
                display:
                  !ghost && hover && draggedId === item.id ? 'none' : 'flex'
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
          {!ghost &&
            hover &&
            hover.path === myPath &&
            hover.place === 'after' && (
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
