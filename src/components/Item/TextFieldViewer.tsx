import React, { useState, useCallback, FormEvent, useContext } from 'react';
import { LocalStoreContext } from '../../App';
import { ItemId } from '../../model/Item/ItemId';
import { LocalStore } from '../../LocalStore/LocalStore';

interface Props {
  id: ItemId;
  value: any;
  type: string;
  name: string;
  params?: any;
}

export const TextFieldViewer: React.FC<Props> = props => {
  const { id, value, type, name, params } = props;
  console.log('tfv', id, name, value);
  const local: LocalStore = useContext(LocalStoreContext);

  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleStartEditing = useCallback(() => {
    setEditing(true);
    setEditValue(value);
  }, [value]);

  const handleFinishEditing = useCallback(() => {
    setEditing(false);
    local.change({
      id: id,
      fieldName: name,
      oldValue: undefined,
      newValue: editValue
    });
  }, [local, editValue]);

  const handleEditValueChanged = useCallback(
    (event: FormEvent<HTMLInputElement>) => {
      setEditValue(event.currentTarget.value);
    },
    []
  );

  return (
    <div>
      {!editing && <div onClick={handleStartEditing}>{value}</div>}
      {editing && (
        <input
          type="text"
          value={editValue}
          onChange={handleEditValueChanged}
          onBlur={handleFinishEditing}
        />
      )}
    </div>
  );
};
