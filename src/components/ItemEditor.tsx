import React from 'react';
import { useDispatch } from 'react-redux';
import { StoredItem } from '../store/state/Item';

interface Props {
  item: StoredItem;
}

const fieldList = ['description', 'title'];

export const ItemEditor: React.FC<Props> = props => {
  const { item } = props;

  const dispatch = useDispatch();

  const handleUpdate = React.useCallback(
    (item: StoredItem, fieldName: string) => (event: any) => {
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

  React.useEffect(() => {
    console.log('changed', props);
  }, [props]);

  return (
    <div>
      <div>{item.id || item.tmpId}</div>
      {fieldList.map(fieldName => (
        <div key={fieldName}>
          {fieldName}:{' '}
          <input
            defaultValue={item.fields[fieldName]}
            onBlur={handleUpdate(item, fieldName)}
          />
        </div>
      ))}
    </div>
  );
};
