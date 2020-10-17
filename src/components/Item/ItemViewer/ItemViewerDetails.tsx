import React, { useCallback, useContext, FormEvent } from 'react';
import { ViewItem } from '../../../model/Item/ViewItem';
import { ActionsContext } from '../../../App';
import { Actions } from '../../../LocalStore/Actions';
import { ItemId } from '../../../model/Item/ItemId';
import { RelationType } from '../../../model/Relation/RelationType';
import { FieldViewer } from '../FieldViewer';
import { FieldTypeOf, fieldTypeList } from '../../../model/Item/FieldTypeOf';
import { propsStyle } from './ItemViewer.style';

export interface Props {
  item: ViewItem;
  handleNewOpen: () => void;
}

export const ItemViewerDetails: React.FC<Props> = props => {
  const { item, handleNewOpen } = props;

  const actions: Actions = useContext(ActionsContext);

  const handleDetachFromParent = useCallback(
    (id: ItemId) => (_: any) => {
      if (item.parents.length === 0) return;
      const parentId = item.parents[0];
      actions.removeRelation(id, RelationType.Parent, parentId);
    },
    [actions, item]
  );

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

  return (
    <div className={propsStyle}>
      {item.fields.map(field => (
        <div key={field.name}>
          <FieldViewer id={item.id} {...field} />
          {field.auxilaryValues.map((value, index) => (
            <div key={index}>
              {value ? `${item.auxilaryColumns[index]}: ${value}` : ''}
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
      <button onClick={handleNewOpen}>+ Add child</button>
      <button onClick={handleDetachFromParent(item.id)}>
        - Detach first parent
      </button>
    </div>
  );
};
