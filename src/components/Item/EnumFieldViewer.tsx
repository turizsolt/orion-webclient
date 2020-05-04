import React, { useCallback, FormEvent } from 'react';
import { FieldProps } from './FieldViewer';

export const EnumFieldViewer: React.FC<FieldProps> = props => {
  const { value, onChange, params } = props;

  const handleChanged = useCallback(
    (event: FormEvent<HTMLSelectElement>) => {
      onChange(event.currentTarget.value);
    },
    [onChange]
  );

  const values = params.values as string[];

  return (
    <div>
      <select onChange={handleChanged} value={value}>
        {values.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};
