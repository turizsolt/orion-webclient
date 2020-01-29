import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StoredItem, ItemId } from '../store/state/Item';
import { RootState } from '../store';
import { fieldSchema } from '../FieldSchema';
import { Field } from './Fields/Field';

interface Props {
  itemId: ItemId;
}

export const ItemEditor: React.FC<Props> = props => {
  const { itemId } = props;

  const [item, setItem] = React.useState<StoredItem | undefined>(undefined);
  const [fields, setFields] = React.useState<any>({});

  const { byId } = useSelector(
    (state: RootState) => state.appReducer.itemRepository
  );

  const dispatch = useDispatch();

  React.useEffect(() => {
    const foundItem = byId[itemId];
    setItem(foundItem);
    if (foundItem) {
      setFields(foundItem.fields);
    }
  }, [byId, itemId]);

  const handleUpdate = React.useCallback(
    (fieldName: string) => (event: any) => {
      if (!item) return;
      if (item.fields[fieldName] === event.target.value) return;

      dispatch({
        type: 'UPDATE_ITEM',
        payload: {
          id: item.id,
          changes: [
            {
              id: item.id,
              tempId: item.tmpId,
              field: fieldName,
              oldValue: item.fields[fieldName],
              newValue: event.target.value
            }
          ]
        }
      });
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
          <div>{item.id || item.tmpId}</div>
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
