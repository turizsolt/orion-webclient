import React, { useCallback, useContext } from 'react';
import { TextFieldViewer } from './TextFieldViewer';
import { ViewItem } from '../../model/Item/ViewItem';
import { ActualIdGenerator } from '../../idGenerator/ActualIdGenerator';
import { LocalStoreContext } from '../../App';
import { LocalStore } from '../../LocalStore/LocalStore';
import { ItemId } from '../../model/Item/ItemId';
import { RelationType } from '../../model/Relation/RelationType';
import { useSelector } from 'react-redux';

interface Props {
  item: ViewItem;
}

const idGen = new ActualIdGenerator();

export const ItemViewer: React.FC<Props> = props => {
  const { item } = props;
  const { items } = useSelector((state: any) => state.appReducer);
  const local: LocalStore = useContext(LocalStoreContext);

  const handleClick = useCallback(
    (parentId: ItemId) => (event: any) => {
      const childrenId = idGen.generate();
      local.changeItem({
        id: childrenId,
        fieldName: 'title',
        oldValue: undefined,
        newValue: 'new kid'
      });
      local.addRelation(parentId, RelationType.Child, childrenId);
    },
    [local]
  );

  return (
    <div style={{ border: '1px solid aqua', marginLeft: '20px' }}>
      <div>{item.id}</div>
      {item.fields.map(field => (
        <TextFieldViewer key={field.name} id={item.id} {...field} />
      ))}
      {item.children.map(child => (
        <ItemViewer key={child} item={items[child]} />
      ))}
      <button onClick={handleClick(item.id)}>Add Children</button>
    </div>
  );
};
