import React from 'react';
import { FieldProps } from '../FieldViewer';
import { EditableFieldViewer, EditableProps } from './EditableFieldViewer';
import { SketchPicker, ColorResult } from 'react-color';

export const ColorFieldViewer: React.FC<FieldProps> = props => {
  return <EditableFieldViewer {...props} input={Input} />;
};

const handleChangeComplete = (onChange: any) => (result: ColorResult) => {
  onChange({ currentTarget: { value: result.hex } });
};

const Input: React.FC<EditableProps> = props => {
  return (
    <>
      <SketchPicker
        color={props.value}
        onChangeComplete={handleChangeComplete(props.onChange)}
      />
      <button onClick={props.onBlur}>Save</button>
    </>
  );
};
