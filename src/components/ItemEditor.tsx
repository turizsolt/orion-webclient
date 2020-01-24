import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StoredItem, ItemId } from '../store/state/Item';
import { RootState } from '../store';
import { fieldSchema } from '../FieldSchema';
import { Field } from './Fields/Field';
import { updateItem } from '../store/actions';
import { ActualIdGenerator } from '../idGenerator/ActualIdGenerator';
import { Change } from '../store/state/Change';

const idGenerator = new ActualIdGenerator();

interface Props {
  itemId: ItemId;
}

export const ItemEditor: React.FC<Props> = props => {
  const { itemId } = props;

  const [item, setItem] = React.useState<StoredItem | undefined>(undefined);
  const [fields, setFields] = React.useState<any>({});

  const { byId } = useSelector((state: RootState) => state.appReducer.items);

  const dispatch = useDispatch();

  React.useEffect(() => {
    const foundItem = byId[itemId];
    setItem(foundItem);
    if (foundItem) {
      setFields(foundItem.fieldsCentral);
    }
  }, [byId, itemId]);

  const handleUpdate = React.useCallback(
    (fieldName: string) => (event: any) => {
      if (!item) return;
      if (item.fieldsCentral[fieldName] === event.target.value) return;

      const change: Change = {
        type: 'UpdateItem',
        id: idGenerator.generate(),
        data: {
          itemId: item.id,
          field: fieldName,
          oldValue: item.fieldsCentral[fieldName],
          newValue: event.target.value
        }
      };
      dispatch(updateItem.started(change));
    },
    [dispatch, item]
  );

  const handleClose = React.useCallback(() => {
    dispatch({
      type: 'SELECT_ITEM',
      payload: {
        id: undefined
      }
    });
  }, [dispatch]);

  const handleChange = React.useCallback(
    (fieldName: string) => (event: any) => {
      setFields({ ...fields, [fieldName]: event.target.value });
    },
    [fields]
  );

  return (
    <div>
      {item && (
        <>
          <button onClick={handleClose}>Close</button>
          <div>{item.id}</div>
          {fieldSchema.map(field => (
            <Field
              key={field.name}
              field={field}
              fields={fields}
              onChange={handleChange}
              onBlur={handleUpdate}
            />
          ))}
        </>
      )}
    </div>
  );
};
