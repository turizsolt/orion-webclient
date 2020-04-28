import React from 'react';
import { FieldProps } from '../FieldViewer';
import { EditableFieldViewer, EditableProps } from './EditableFieldViewer';

export const ColorFieldViewer: React.FC<FieldProps> = props => {
  return <EditableFieldViewer {...props} input={Input} />;
};

const Input: React.FC<EditableProps> = props => {
  return <input autoFocus type="color" {...props} />;
};
