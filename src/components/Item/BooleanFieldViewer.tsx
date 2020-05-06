import React, { useCallback, FormEvent } from 'react';
import { FieldProps } from './FieldViewer';

export const BooleanFieldViewer: React.FC<FieldProps> = props => {
  const { value, onChange } = props;

  const handleChanged = useCallback(
    (event: FormEvent<HTMLInputElement>) => {
      onChange(event.currentTarget.checked);
    },
    [onChange]
  );

  return (
    <div style={{ flexGrow: 1 }}>
      <input type="checkbox" checked={value} onChange={handleChanged} />
    </div>
  );
};
