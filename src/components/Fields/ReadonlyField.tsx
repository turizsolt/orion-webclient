import React from 'react';

interface Props {
  field: any;
  fields: Record<string, any>;
  onChange: (fieldName: string) => (event: any) => void;
  onBlur: (fieldName: string) => (event: any) => void;
}

export const ReadonlyField: React.FC<Props> = props => {
  const { fields, field } = props;
  return (
    <div key={field.name}>
      {field.name}: {fields[field.name] ? fields[field.name] : ''}
    </div>
  );
};
