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
interface Props {
  item: ViewItem;
  parentId: ItemId | null;
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
  const { item, parentId } = props;
  const { items } = useSelector((state: any) => state.appReducer);
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

  const f = (x: ItemId) => {
    return true;
    //  !items[x].originalFields.deleted ||
    //  items[x].originalFields.deleted.value !== true
    //);
  };

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
    return parseInt(items[c].originalFields.priority.value, 10);
  };

  const order = (arr: ItemId[]): ItemId[] => {
    arr.sort((a, b) => {
      if (x(a) < x(b)) return -1;
      if (x(a) > x(b)) return 1;
      return 0;
    });
    return arr;
  };

  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.ITEM, id: item.id },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: !!monitor.isDragging()
    })
  });

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.ITEM,
    drop: (dragged: any, monitor: DropTargetMonitor) => {
      console.log('dropped', dragged.id, '>', item.id);
      console.log('parent', parentId);

      let max = 0;
      if (parentId) {
        console.log('children', items[parentId].children);

        for (let i = 0; i < items[parentId].children.length; i++) {
          const id = items[parentId].children[i];
          if (x(id) >= x(item.id)) {
            continue;
          }
          if (x(id) > max) {
            max = x(id);
          }
        }
        console.log('max', max);
      }

      const newPrio = Math.round(
        (item.originalFields.priority.value + max) / 2
      );

      actions.changeItem(
        dragged.id,
        'priority',
        items[dragged.id].originalFields.priority &&
          items[dragged.id].originalFields.priority.value,
        newPrio
      );
    },
    hover: (dragged: any, monitor: DropTargetMonitor) =>
      console.log('hover', dragged.id, '>', item.id),
    collect: (monitor: DropTargetMonitor) => ({
      isOver: !!monitor.isOver()
    })
  });

  const ref: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  drag(drop(ref));

  return (
    <>
      {item && (
        <>
          {false && <div>[{item.auxilaryColumns.join(', ')}]</div>}
          <div className={itemStyle}>
            <div
              className={headerStyle}
              ref={ref}
              style={{
                opacity: isDragging ? 0.5 : 1,
                color: isOver ? 'red' : 'inherit'
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
                {childrenCollapsed ? item.children.length : '-'}
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
          <div className={childrenStyle}>
            {!childrenCollapsed &&
              order(item.children)
                .filter(f)
                .map(child => (
                  <ItemViewer
                    key={child}
                    item={items[child]}
                    parentId={item.id}
                  />
                ))}
            {showChildrenAdder && (
              <ItemAdderViewer parentId={item.id} onClose={handleNewClose} />
            )}
          </div>
        </>
      )}
    </>
  );
};
