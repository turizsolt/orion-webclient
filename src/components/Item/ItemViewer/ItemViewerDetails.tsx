import React, {
  useCallback,
  useContext,
  FormEvent,
  KeyboardEvent,
  ChangeEvent
} from 'react';
import { ViewItem } from '../../../model/Item/ViewItem';
import { ActionsContext } from '../../../App';
import { Actions } from '../../../LocalStore/Actions';
import { ItemId } from '../../../model/Item/ItemId';
import { RelationType } from '../../../model/Relation/RelationType';
import { FieldViewer } from '../FieldViewer';
import { FieldTypeOf, fieldTypeList } from '../../../model/Item/FieldTypeOf';
import {
  propsStyle,
  hashtagStyle,
  hashtagContainerStyle,
  hashtagLabelStyle,
  hashtagRowStyle,
  hashtagDetailedListStyle,
} from './ItemViewer.style';
import { useSelector } from 'react-redux';
import {
  getField,
  getRandomColor
} from '../../../ReduxStore/commons';
import { RootState } from '../../../ReduxStore';
import { Hashtag } from '../../Hashtag';

export interface Props {
  item: ViewItem;
  panelId: number;
  handleNewOpen: () => void;
}

export const ItemViewerDetails: React.FC<Props> = props => {
  const { item, handleNewOpen, panelId } = props;

  const { items, itemList } = useSelector(
    (state: RootState) => state.appReducer
  );

  const actions: Actions = useContext(ActionsContext);

  const handleDetachFromParent = useCallback(
    (id: ItemId) => (_: any) => {
      if (item.parents.length === 0) return;
      const parentId = item.parents[0];
      actions.removeRelation(id, RelationType.Parent, parentId);
    },
    [actions, item]
  );

  const handleAddTemplate = useCallback(
    () => {
      const newId = actions.createItem('title', 'tmp');
      actions.changeItem(newId, 'template', false, true);
      actions.addRelation(
        item.id,
        RelationType.Template,
        newId,
      );
    },
    [item, actions]
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

        if (!hashId) {
          actions.changeItem(newHashId, 'color', undefined, getRandomColor());
        }

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

  const handleSelectUser = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const resp = event.currentTarget.value;
      if (resp) {
        actions.addRelation(item.id, RelationType.Responsible, resp);
      }
    },
    [item, actions]
  );

  const handleRemoveUser = useCallback(
    (id: ItemId) => () => {
      actions.removeRelation(item.id, RelationType.Responsible, id);
    },
    [item, actions]
  );

  const handleShallowCopy = useCallback(
    () => {
      actions.shallowCopy(item.id);
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
      <div className={hashtagContainerStyle}>
        <div className={hashtagRowStyle}>
          <div className={hashtagLabelStyle}>hashtags:</div>
          <div className={hashtagDetailedListStyle}>
            {item.hashtags.map(x => (
              <Hashtag hashtag={x} removeHashtag={handleRemoveHashtag(x.id)} key={x.id} panelId={panelId} />
            ))}
            <span
              className={hashtagStyle}
              style={{
                color: 'black',
                backgroundColor: 'white'
              }}
            >
              #<input type="text" onKeyDown={handleAddHashtag} />
            </span>
          </div>
        </div>
      </div>
      <div>
        Responsibles:{' '}
        {item.responsibles.map(responsible => (
          <span key={responsible.id}>
            {responsible.username}&nbsp;
            <span onClick={handleRemoveUser(responsible.id)}>(x)</span>
          </span>
        ))}
        <select onChange={handleSelectUser}>
          <option value={''}>Add responsible</option>
          {itemList
            .filter(x => getField(x, 'username', items))
            .map((userId: ItemId) => (
              <option key={userId} value={userId}>
                {getField(userId, 'username', items)}
              </option>
            ))}
        </select>
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
      <button onClick={handleAddTemplate}>+ Add template</button>
      <button onClick={handleDetachFromParent(item.id)}>
        - Detach first parent
      </button>
      <button onClick={handleShallowCopy}>
        SCopy
      </button>
    </div>
  );
};
