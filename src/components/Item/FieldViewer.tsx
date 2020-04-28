import React, { useContext, useCallback } from 'react';
import { ItemId } from '../../model/Item/ItemId';
import { StringFieldViewer } from './EditableFieldViewer/StringFieldViewer';
import { TextFieldViewer } from './EditableFieldViewer/TextFieldViewer';
import { LocalStore } from '../../LocalStore/LocalStore';
import { LocalStoreContext } from '../../App';
import { BooleanFieldViewer } from './BooleanFieldViewer';
import { EnumFieldViewer } from './EnumFieldViewer';
import { NumberFieldViewer } from './EditableFieldViewer/NumberFieldViewer';
import { DateFieldViewer } from './EditableFieldViewer/DateFieldViewer';
import { ColorFieldViewer } from './EditableFieldViewer/ColorFieldViewer';
import { style } from 'typestyle';

interface Props {
  id: ItemId;
  value: any;
  type: string;
  name: string;
  params?: any;
}

export interface FieldProps extends Props {
  onChange: (value: any) => void;
}

const fieldStyle = style({
  display: 'flex',
  minHeight: '1.5em',
  flexGrow: 1
});

const labelStyle = style({
  width: '80px'
});

export const FieldViewer: React.FC<Props> = props => {
  const { type, id, name, params } = props;

  const local: LocalStore = useContext(LocalStoreContext);

  const handleChange = useCallback(
    (value: any) => {
      local.changeItem({
        id: id,
        fieldName: name,
        oldValue: undefined,
        newValue: value
      });
    },
    [local, id, name]
  );

  const fieldProps = { ...props, onChange: handleChange };
  const noLabel = params && params.noLabel;

  return (
    <div className={fieldStyle}>
      {!noLabel && <div className={labelStyle}>{name}</div>}
      {type === 'Enum' && <EnumFieldViewer {...fieldProps} />}
      {type === 'Boolean' && <BooleanFieldViewer {...fieldProps} />}
      {type === 'Color' && <ColorFieldViewer {...fieldProps} />}
      {type === 'Date' && <DateFieldViewer {...fieldProps} />}
      {type === 'Number' && <NumberFieldViewer {...fieldProps} />}
      {type === 'String' && <StringFieldViewer {...fieldProps} />}
      {type === 'Text' && <TextFieldViewer {...fieldProps} />}
    </div>
  );
};
