import React, { useCallback, useContext, useState } from 'react';
import { ViewItem } from '../../model/Item/ViewItem';
import { LocalStoreContext } from '../../App';
import { LocalStore } from '../../LocalStore/LocalStore';
import { ItemId } from '../../model/Item/ItemId';
import { RelationType } from '../../model/Relation/RelationType';
import { useSelector } from 'react-redux';
import { FieldViewer } from './FieldViewer';
import { style } from 'typestyle';
import { StateDot } from './StateDot';
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

export const ItemViewer: React.FC<Props> = props => {
  const { item } = props;
  const { items } = useSelector((state: any) => state.appReducer);
  const local: LocalStore = useContext(LocalStoreContext);

  const [collapsed, setCollapsed] = useState(false);

  const handleClick = useCallback(
    (parentId: ItemId) => (event: any) => {
      const childrenId = local.createItem();
      local.addRelation(parentId, RelationType.Child, childrenId);
    },
    [local]
  );

  const handleCollapse = useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed]);

  return (
    <>
      <div className={itemStyle}>
        <div className={headerStyle}>
          <StateDot symbol={item.updateness} />
          <FieldViewer
            id={item.id}
            {...item.fields[0]}
            params={{ noLabel: true }}
          />
          <div>{item.id}</div>
          <button onClick={handleCollapse}>{collapsed ? 'V' : 'A'}</button>
        </div>
        {!collapsed && (
          <div className={propsStyle}>
            {item.fields.map(field => (
              <FieldViewer key={field.name} id={item.id} {...field} />
            ))}
            <button onClick={handleClick(item.id)}>+ Add child</button>
          </div>
        )}
      </div>
      <div className={childrenStyle}>
        {item.children.map(child => (
          <ItemViewer key={child} item={items[child]} />
        ))}
      </div>
    </>
  );
};
