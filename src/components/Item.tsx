import React from 'react';
import { useDispatch } from 'react-redux';
import { ItemId, StoredItem } from '../store/state/Item';

interface Props {
  item: StoredItem;
}

export const Item: React.FC<Props> = props => {
  const { item } = props;

  const dispatch = useDispatch();

  const handleUpdateRandom = React.useCallback(
    (id: ItemId, tmpId: ItemId | undefined, oldValue: string) => () => {
      dispatch({
        type: 'UPDATE_ITEM',
        payload: {
          id,
          changes: [
            {
              id,
              field: 'title',
              oldValue,
              newValue: 'NEW' + Math.random()
            }
          ]
        }
      });
    },
    [dispatch]
  );

  return (
    <div
      style={{ border: '1px solid black', padding: '10px', display: 'flex' }}
    >
      <div style={{ width: '120px' }}>{item.id || item.tmpId}</div>
      <div style={{ width: '240px' }}>
        <div>
          {!!item.fieldsChanging.title && (
            <span
              style={{
                marginRight: '10px',
                display: 'inline-block',
                width: '10px',
                height: '10px',
                borderRadius: '5px',
                backgroundColor: 'red'
              }}
            />
          )}
          <b>{item.fieldsChanging.title || item.fields.title}</b>
        </div>
        <div>
          {!!item.fieldsChanging.description && (
            <span
              style={{
                marginRight: '10px',
                display: 'inline-block',
                width: '10px',
                height: '10px',
                borderRadius: '5px',
                backgroundColor: 'red'
              }}
            />
          )}
          {item.fieldsChanging.description || item.fields.description}
        </div>
      </div>
      <button
        onClick={handleUpdateRandom(
          item.id,
          item.tmpId,
          item.fields && item.fields.title
        )}
      >
        Update random
      </button>
    </div>
  );
};
