import React from 'react';
import { FieldProps } from '../FieldViewer';
import { EditableFieldViewer, EditableProps } from './EditableFieldViewer';

export const TextFieldViewer: React.FC<FieldProps> = props => {
  return <EditableFieldViewer {...props} input={TextArea} />;
};

const TextArea: React.FC<EditableProps> = props => {
  return <textarea {...props} />;
};
