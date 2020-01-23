import React from 'react';
import { StringField } from './StringField';
import { TextField } from './TextField';
import { EnumField } from './EnumField';
import { DateField } from './DateField';
import { ReadonlyField } from './ReadonlyField';

interface Props {
  field: any;
  fields: Record<string, any>;
  onChange: (fieldName: string) => (event: any) => void;
  onBlur: (fieldName: string) => (event: any) => void;
}

export const Field: React.FC<Props> = props => {
  const { field } = props;

  if (field.readonly) return <ReadonlyField {...props} />;

  if (field.type === 'date') return <DateField {...props} />;
  if (field.type === 'text') return <TextField {...props} />;
  if (field.type === 'enum') return <EnumField {...props} />;
  return <StringField {...props} />;
};
