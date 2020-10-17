import React, {
  useCallback,
  useContext,
  useState,
  FormEvent,
  useRef,
  RefObject
} from 'react';
import { ViewItem } from '../../model/Item/ViewItem';
import { ActionsContext } from '../../App';
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
import { useItemDnD } from './useItemDnD';

export interface ItemViewerProps {
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

export const ItemViewer: React.FC<ItemViewerProps> = props => {
  const ref: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  const { item, path, ghost } = props;
  const myPath = path + (path ? '_' : '') + item.id;
  const { items, itemsMeta, hover, draggedId } = useSelector(
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

  const [drag, drop, isDragging] = useItemDnD(
    props,
    actions,
    childrenCollapsed
  );

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
