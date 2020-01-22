import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StoredItem, ItemId } from '../store/state/Item';
import { RootState } from '../store';

interface Props {
  itemId: ItemId;
}

const fieldList = ['title', 'description'];

export const ItemEditor: React.FC<Props> = props => {
  const { itemId } = props;

  const [item, setItem] = React.useState<StoredItem | undefined>(undefined);
  const [fields, setFields] = React.useState<any>({});

  const { items } = useSelector(
    (state: RootState) => state.appReducer.itemRepository
  );

  const dispatch = useDispatch();

  React.useEffect(() => {
    const foundItem = items.find(x => x.id === itemId);
    setItem(foundItem);
    if (foundItem) {
      setFields(foundItem.fields);
    }
  }, [items, itemId]);

  const handleUpdate = React.useCallback(
    (item: StoredItem, fieldName: string) => (event: any) => {
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
    [dispatch]
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
          {fieldList.map(fieldName => (
            <div key={fieldName}>
              {fieldName}:{' '}
              <input
                value={fields[fieldName] ? fields[fieldName] : ''}
                onChange={handleChange(fieldName)}
                onBlur={handleUpdate(item, fieldName)}
              />
            </div>
          ))}
        </>
      )}
    </div>
  );
};
