import React, { useContext, useCallback } from 'react';
import { ItemId } from '../../model/Item/ItemId';
import { StringFieldViewer } from './StringFieldViewer';
import { TextFieldViewer } from './TextFieldViewer';
import { LocalStore } from '../../LocalStore/LocalStore';
import { LocalStoreContext } from '../../App';

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

export const FieldViewer: React.FC<Props> = props => {
  const { type, id, name } = props;

  const local: LocalStore = useContext(LocalStoreContext);

  const handleChange = useCallback(
    (value: any) => (_: any) => {
      local.changeItem({
        id: id,
        fieldName: name,
        oldValue: undefined,
        newValue: value
      });
    },
    [local, id]
  );

  const fieldProps = { ...props, onChange: handleChange };

  return (
    <>
      {type === 'String' && <StringFieldViewer {...fieldProps} />}
      {type === 'Text' && <TextFieldViewer {...fieldProps} />}
    </>
  );
};
