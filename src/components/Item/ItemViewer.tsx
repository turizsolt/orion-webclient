import React, { useCallback, useContext, useState, FormEvent } from 'react';
import { ViewItem } from '../../model/Item/ViewItem';
import { LocalStoreContext, idGen } from '../../App';
import { LocalStore } from '../../LocalStore/LocalStore';
import { ItemId } from '../../model/Item/ItemId';
import { RelationType } from '../../model/Relation/RelationType';
import { useSelector } from 'react-redux';
import { FieldViewer } from './FieldViewer';
import { style } from 'typestyle';
import { StateDot } from './StateDot';
import { Link } from 'react-router-dom';
import { ItemAdderViewer } from './ItemAdderViewer';
import { FieldTypeOf, fieldTypeList } from '../../model/Item/FieldTypeOf';
interface Props {
  item: ViewItem;
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
  const { item } = props;
  const { items } = useSelector((state: any) => state.appReducer);
  const local: LocalStore = useContext(LocalStoreContext);

  const [collapsed, setCollapsed] = useState(true);

  const handleDetachFromParent = useCallback(
    (id: ItemId) => (_: any) => {
      if (item.parents.length === 0) return;
      const parentId = item.parents[0];
      local.removeRelation(id, RelationType.Parent, parentId);
    },
    [local, item]
  );

  const handleCollapse = useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed]);

  const handleAddField = useCallback(
    (event: FormEvent<HTMLSelectElement>) => {
      const field = event.currentTarget.value;
      local.changeItem({
        id: item.id,
        changes: [
          {
            changeId: idGen.generate(),
            field,
            oldValue: undefined,
            newValue: FieldTypeOf(field).getDefaultValue()
          }
        ]
      });
      event.currentTarget.value = '';
    },
    [item, local]
  );

  const [showChildrenAdder, setShowChildrenAdder] = useState(false);

  const handleNew = useCallback(() => {
    setShowChildrenAdder(true);
  }, []);

  const handleNewClose = useCallback(() => {
    setShowChildrenAdder(false);
  }, []);

  return (
    <>
      {item && (
        <>
          {false && <div>[{item.auxilaryColumns.join(', ')}]</div>}
          <div className={itemStyle}>
            <div className={headerStyle}>
              <StateDot symbol={item.updateness} />
              <FieldViewer
                id={item.id}
                {...item.fields[0]}
                params={{ noLabel: true }}
              />
              <div>
                <Link to={`/${item.id}`}>{item.id.substr(0, 6)}</Link>
              </div>
              <button className={headerButtonStyle} onClick={handleNew}>
                {'+'}
              </button>
              <button className={headerButtonStyle} onClick={handleCollapse}>
                {collapsed ? 'V' : 'A'}
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
            {item.children.map(child => (
              <ItemViewer key={child} item={items[child]} />
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
