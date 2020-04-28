import React, { useState, useCallback, FormEvent } from 'react';
import { FieldProps } from '../FieldViewer';

export interface EditableProps {
  value: any;
  onChange: any;
  onBlur: any;
}

interface Props extends FieldProps {
  input: React.FC<EditableProps>;
}

export const EditableFieldViewer: React.FC<Props> = props => {
  const { value, onChange, input: Input } = props;

  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleStartEditing = useCallback(() => {
    setEditing(true);
    setEditValue(value);
  }, [value]);

  const handleFinishEditing = useCallback(() => {
    setEditing(false);
    onChange(editValue);
  }, [editValue, onChange]);

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
        <Input
          value={editValue}
          onChange={handleEditValueChanged}
          onBlur={handleFinishEditing}
        />
      )}
    </div>
  );
};
