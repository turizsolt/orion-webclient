import { ItemTypes } from '../../App';
import {
  useDrag,
  DragSourceMonitor,
  useDrop,
  DropTargetMonitor,
  DragElementWrapper,
  DragSourceOptions
} from 'react-dnd';
import { useSelector } from 'react-redux';
import { ItemId } from '../../model/Item/ItemId';
import {
  fillInPrioritiesOfAParent,
  getPriority,
  common
} from '../../ReduxStore/commons';
import { RelationType } from '../../model/Relation/RelationType';
import { Actions } from '../../LocalStore/Actions';
import { ItemViewerProps } from './ItemViewer/ItemViewer';

export function useItemDnD(
  props: ItemViewerProps,
  actions: Actions,
  childrenCollapsed: boolean
): [
  DragElementWrapper<DragSourceOptions>,
  DragElementWrapper<DragSourceOptions>
] {
  const { item, parentId, path, ghost } = props;
  const myPath = path + (path ? '_' : '') + item.id;

  const { items, itemsMeta, viewedItemList, hover, draggedId } = useSelector(
    (state: any) => state.appReducer
  );

  const drag = useDrag({
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
  })[1];

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

  return [drag, drop];
}
