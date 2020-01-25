import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ItemId, StoredItem } from '../store/state/Item';
import { RootState } from '../store';
import { selectItem } from '../store/actions';

interface Props {
  item: StoredItem;
}

export const Item: React.FC<Props> = props => {
  const { item } = props;

  const selectedId = useSelector(
    (state: RootState) => state.appReducer.selectedItemId
  );

  const items = useSelector((state: RootState) => state.appReducer.items);

  const dispatch = useDispatch();

  const handleSelect = React.useCallback(
    (id: ItemId) => () => {
      dispatch(selectItem({ id }));
    },
    [dispatch]
  );

  return (
    <>
      {!item && <div>UNDEFINED</div>}
      {item && (
        <>
          <div
            style={{
              border: '1px solid black',
              padding: '10px',
              display: 'flex',
              backgroundColor: selectedId === item.id ? 'aqua' : 'inherit'
            }}
          >
            <div style={{ width: '120px' }}>{item.id.substring(0, 6)}</div>
            <div style={{ width: '80px' }}>
              {!!item.fieldsLocal.state && (
                <span
                  style={{
                    marginRight: '5px',
                    display: 'inline-block',
                    width: '10px',
                    height: '10px',
                    borderRadius: '5px',
                    backgroundColor: 'red'
                  }}
                />
              )}
              <i>{item.fieldsLocal.state || item.fieldsCentral.state}</i>
            </div>
            <div style={{ width: '240px' }}>
              <div>
                {!!item.fieldsLocal.title && (
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
                <b>{item.fieldsLocal.title || item.fieldsCentral.title}</b>
              </div>
              <div>
                {!!item.fieldsLocal.description && (
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
                {item.fieldsLocal.description || item.fieldsCentral.description}
              </div>
              <div>
                Ch: {item.fieldsLocal.children || item.fieldsCentral.children} |
                P: {item.fieldsLocal.parents || item.fieldsCentral.parents}
              </div>
            </div>
            <button onClick={handleSelect(item.id)}>Select</button>
          </div>
          <div style={{ marginLeft: '40px' }}>
            {(
              item.fieldsLocal.children ||
              item.fieldsCentral.children ||
              []
            ).map((child: ItemId) => (
              <Item key={child} item={items.byId[child]} />
            ))}
          </div>
        </>
      )}
    </>
  );
};
