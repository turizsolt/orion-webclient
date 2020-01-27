import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ItemId, StoredItem, Item as ItemX } from '../store/state/Item';
import { RootState } from '../store';
import { selectItem, createItem, createRelation } from '../store/actions';
import { ActualIdGenerator } from '../idGenerator/ActualIdGenerator';
import { Change } from '../store/state/Change';
import { ItemTitle } from './ItemTitle';

interface Props {
  item: StoredItem;
}

const idGenerator = new ActualIdGenerator();

export const Item: React.FC<Props> = props => {
  const { item } = props;

  const [open, setOpen] = useState(true);

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

  const handleAddChild = React.useCallback(
    (id: ItemId) => (event: any) => {
      const genId = idGenerator.generate();

      const itemx: ItemX = {
        id: genId,
        fields: {
          title: '',
          createdAt: new Date().toISOString(),
          description: '',
          state: 'todo'
        }
      };

      const change: Change = {
        type: 'CreateItem',
        id: idGenerator.generate(),
        data: {
          item: itemx
        }
      };

      const change2: Change = {
        type: 'CreateRelation',
        id: idGenerator.generate(),
        data: {
          parentId: item.id,
          childId: genId
        }
      };

      dispatch(createItem.started(change));
      dispatch(createRelation.started(change2));
      dispatch(selectItem({ id: genId }));
      setOpen(true);

      event.stopPropagation();
    },
    [dispatch, item]
  );

  const handleToggleOpen = useCallback(() => {
    setOpen(!open);
  }, [open]);

  const children = item
    ? [
        ...arrify(item.fieldsCentral.children),
        ...arrify(item.fieldsLocal.children)
      ]
    : [];

  return (
    <>
      {!item && <div>UNDEFINED</div>}
      {item && (
        <>
          <div
            onClick={handleSelect(item.id)}
            style={{
              border: '1px solid black',
              padding: '10px',
              display: 'flex',
              backgroundColor: selectedId === item.id ? 'aqua' : 'inherit'
            }}
          >
            {/* state */}
            <div style={{ width: '30px' }}>
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
              <i>
                {(item.fieldsLocal.state || item.fieldsCentral.state).substring(
                  3,
                  4
                )}
              </i>
            </div>

            {/* title */}
            <div style={{ width: '180px', display: 'flex' }}>
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
              </div>
              <ItemTitle
                item={item}
                title={item.fieldsLocal.title || item.fieldsCentral.title}
              />
            </div>

            {/* add child */}
            <button onClick={handleAddChild(item.id)}>Add&nbsp;child</button>

            {/* open */}
            {children.length > 0 && (
              <button onClick={handleToggleOpen}>
                {open ? 'Close' : `Open (${children.length})`}
              </button>
            )}

            {/* id */}
            <div style={{ width: '80px' }}>{item.id.substring(0, 6)}</div>
          </div>
          {open && (
            <div style={{ marginLeft: '40px' }}>
              {children.map((child: ItemId) => (
                <Item key={child} item={items.byId[child]} />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
};

function arrify(arr: any[] | undefined): any[] {
  if (!arr) return [];
  return arr;
}
