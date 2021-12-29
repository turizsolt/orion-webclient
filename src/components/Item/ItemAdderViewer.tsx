import React, { useCallback, useContext, useState, FormEvent } from 'react';
import { ActionsContext } from '../../App';
import { Actions } from '../../LocalStore/Actions';
import { ItemId } from '../../model/Item/ItemId';
import { RelationType } from '../../model/Relation/RelationType';
import { style } from 'typestyle';
import { StateDot } from './StateDot';
import { Updateness } from '../../model/Updateness';
import { useSelector } from 'react-redux';
import { fillInPrioritiesOfAParent } from '../../ReduxStore/commons';
import { Filter } from '../../model/Filter';
import { RootState } from '../../ReduxStore';
interface Props {
  parentId: ItemId | undefined;
  onClose: () => void;
  panelId: number;
}

const itemStyle = style({
  borderRadius: '20px',
  backgroundColor: '#87b6b8',
  marginBottom: '5px'
});

const headerStyle = style({
  padding: '5px',
  borderRadius: '20px',
  backgroundColor: '#caadce',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '18px'
});

const inner = {
  fontSize: '16px',
  alignItems: 'center',
  width: '100%'
};

const fieldStyle = style({
  display: 'flex',
  minHeight: '1.5em',
  fontSize: '16px',
  padding: '5px 0 5px 0',
  alignItems: 'center',
  flexGrow: 1,
  $nest: {
    '& div.outerInput': { flexGrow: 1 },
    "& input:not([type='checkbox'])": inner,
    '& select': inner,
    '& textarea': { ...inner, height: '60px' }
  }
});

export const ItemAdderViewer: React.FC<Props> = props => {
  const { onClose, parentId, panelId } = props;
  const actions: Actions = useContext(ActionsContext);

  const { items, panelList } = useSelector(
    (state: RootState) => state.appReducer
  );

  const {itemsMeta, viewedItemList, filters} = panelList[panelId];

  const [editValue, setEditValue] = useState('');

  const save = useCallback(
    (value: string) => {
      const childrenId = actions.createItem('title', value);
      const highest = fillInPrioritiesOfAParent(
        parentId,
        itemsMeta,
        viewedItemList,
        items,
        actions
      );
      const priority = highest + Math.pow(2, 20);
      actions.changeItem(childrenId, 'priority', undefined, priority);
      if (parentId) {
        actions.addRelation(parentId, RelationType.Child, childrenId);
      }
      const hashtagIds = filters
        .filter((filter: Filter) => filter.hashtag)
        .map((filter: Filter) => filter.hashtag && filter.hashtag.id);
      for (let hashtagId of hashtagIds) {
        actions.addRelation(hashtagId as string, RelationType.HashOf, childrenId);
      }
    },
    [actions, parentId, items, itemsMeta, viewedItemList, filters]
  );

  const handleKeyDown = useCallback(
    (event: any) => {
      if (event.which === 13 && !event.shiftKey) {
        if (editValue.trim() !== '') {
          save(editValue);
          setEditValue('');
        } else {
          onClose();
        }
      }
    },
    [editValue, save, onClose]
  );

  const handleEditValueChanged = useCallback(
    (event: FormEvent<HTMLInputElement>) => {
      setEditValue(event.currentTarget.value);
    },
    []
  );

  const handleBlur = useCallback(() => {
    if (editValue.trim() !== '') {
      save(editValue);
      setEditValue('');
    }
    onClose();
  }, [editValue, save, onClose]);

  return (
    <>
      <div className={itemStyle}>
        <div className={headerStyle}>
          <StateDot symbol={Updateness.Editing} />
          <div className={fieldStyle}>
            <input
              autoFocus
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              onChange={handleEditValueChanged}
              value={editValue}
            />
          </div>
        </div>
      </div>
    </>
  );
};
