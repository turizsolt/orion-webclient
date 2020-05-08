import React, { useCallback, useContext, useState, FormEvent } from 'react';
import { ActionsContext, idGen } from '../../App';
import { Actions } from '../../LocalStore/Actions';
import { ItemId } from '../../model/Item/ItemId';
import { RelationType } from '../../model/Relation/RelationType';
import { style } from 'typestyle';
import { StateDot } from './StateDot';
import { Updateness } from '../../model/Updateness';
interface Props {
  parentId: ItemId | undefined;
  onClose: () => void;
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
  const { onClose, parentId } = props;
  const actions: Actions = useContext(ActionsContext);

  const [editValue, setEditValue] = useState('');

  const save = useCallback(
    (value: string) => {
      const childrenId = actions.createItem();
      actions.changeItem({
        id: childrenId,
        changes: [
          {
            changeId: idGen.generate(),
            field: 'title',
            oldValue: '',
            newValue: value
          }
        ]
      });
      if (parentId) {
        actions.addRelation(parentId, RelationType.Child, childrenId);
      }
    },
    [actions, parentId]
  );

  const handleKeyDown = useCallback(
    (event: any) => {
      if (event.which === 13 && !event.shiftKey) {
        if (editValue.trim() !== '') {
          console.log('enter');
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
