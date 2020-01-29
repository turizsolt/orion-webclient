import React from 'react';

interface Props {
  field: any;
  fields: Record<string, any>;
  onChange: (fieldName: string) => (event: any) => void;
  onBlur: (fieldName: string) => (event: any) => void;
}

export const EnumField: React.FC<Props> = props => {
  const { fields, field, onBlur, onChange } = props;

  const handleChange = React.useCallback(
    (event: any) => {
      onBlur(field.name)(event);
      onChange(field.name)(event);
    },
    [onBlur, onChange, field]
  );

  return (
    <div key={field.name}>
      {field.name}:{' '}
      <select
        value={fields[field.name] ? fields[field.name] : ''}
        onChange={handleChange}
      >
        {field.values.map((value: string) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
    </div>
  );
};
