import React, { useState, useCallback, FormEvent } from 'react';
import { FieldProps } from './FieldViewer';

export const StringFieldViewer: React.FC<FieldProps> = props => {
  const { value, onChange } = props;

  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleStartEditing = useCallback(() => {
    setEditing(true);
    setEditValue(value);
  }, [value]);

  const handleFinishEditing = useCallback(() => {
    setEditing(false);
    onChange(editValue);
  }, [editValue]);

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
