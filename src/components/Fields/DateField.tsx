import React from 'react';

interface Props {
  field: any;
  fields: Record<string, any>;
  onChange: (fieldName: string) => (event: any) => void;
  onBlur: (fieldName: string) => (event: any) => void;
}

export const DateField: React.FC<Props> = props => {
  const { fields, field, onChange, onBlur } = props;
  return (
    <div key={field.name}>
      {field.name}:{' '}
      <input
        style={{ width: '200px' }}
        value={fields[field.name] ? fields[field.name] : ''}
        onChange={onChange(field.name)}
        onBlur={onBlur(field.name)}
      />
    </div>
  );
};
