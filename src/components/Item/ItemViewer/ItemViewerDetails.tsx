import React, {
  useCallback,
  useContext,
  FormEvent,
  KeyboardEvent
} from 'react';
import { ViewItem } from '../../../model/Item/ViewItem';
import { ActionsContext } from '../../../App';
import { Actions } from '../../../LocalStore/Actions';
import { ItemId } from '../../../model/Item/ItemId';
import { RelationType } from '../../../model/Relation/RelationType';
import { FieldViewer } from '../FieldViewer';
import { FieldTypeOf, fieldTypeList } from '../../../model/Item/FieldTypeOf';
import { propsStyle } from './ItemViewer.style';
import { useSelector } from 'react-redux';
import { getField } from '../../../ReduxStore/commons';

export interface Props {
  item: ViewItem;
  handleNewOpen: () => void;
}

export const ItemViewerDetails: React.FC<Props> = props => {
  const { item, handleNewOpen } = props;

  const { items, itemList } = useSelector((state: any) => state.appReducer);

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

  const handleAddHashtag = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.which === 13) {
        const tag = event.currentTarget.value;
        console.log(tag);
        event.currentTarget.value = '';

        const hashId = itemList.find(
          (id: ItemId) => getField(id, 'hashtag', items) === tag
        );

        let newHashId: ItemId = hashId
          ? hashId
          : actions.createItem('hashtag', tag);

        actions.addRelation(item.id, RelationType.Hash, newHashId);
      }
    },
    [item, actions, itemList, items]
  );

  const handleRemoveHashtag = useCallback(
    (id: ItemId) => () => {
      actions.removeRelation(item.id, RelationType.Hash, id);
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
      <div>
        Hashtags:
        {item.hashtags.map(x => (
          <span style={{ color: x.color }} key={x.hashtag}>
            #{x.hashtag}
            <span onClick={handleRemoveHashtag(x.id)}>[x]</span>
          </span>
        ))}
        <span>
          #<input type="text" onKeyDown={handleAddHashtag} />
        </span>
      </div>
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
