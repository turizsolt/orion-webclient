import React, { useState, useCallback, FormEvent } from 'react';
import { FieldProps } from '../FieldViewer';

export interface EditableProps {
  value: any;
  onChange: any;
  onBlur: any;
  onKeyDown: any;
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

  const handleKeyDown = useCallback(
    (event: any) => {
      if (event.which === 13 && !event.shiftKey) {
        setEditing(false);
        onChange(editValue);
      }
    },
    [editValue, onChange]
  );

  const handleEditValueChanged = useCallback(
    (event: FormEvent<HTMLInputElement>) => {
      setEditValue(event.currentTarget.value);
    },
    []
  );

  return (
    <div className="outerInput">
      {!editing && (
        <div onClick={handleStartEditing}>
          {(value && value.toString()) || '[not set]'}
        </div>
      )}
      {editing && (
        <Input
          value={editValue}
          onChange={handleEditValueChanged}
          onBlur={handleFinishEditing}
          onKeyDown={handleKeyDown}
        />
      )}
    </div>
  );
};
