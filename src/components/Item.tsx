import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ItemId, StoredItem, Item as ItemX } from '../store/state/Item';
import { RootState } from '../store';
import { selectItem, createItem, createRelation } from '../store/actions';
import { ActualIdGenerator } from '../idGenerator/ActualIdGenerator';
import { Change } from '../store/state/Change';

interface Props {
  item: StoredItem;
}

const idGenerator = new ActualIdGenerator();

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

  const handleAddChild = React.useCallback(
    (id: ItemId) => () => {
      const genId = idGenerator.generate();

      const itemx: ItemX = {
        id: genId,
        fields: {
          title: 'New child',
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
    },
    [dispatch, item]
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
            </div>
            <button onClick={handleSelect(item.id)}>Select</button>
            <button onClick={handleAddChild(item.id)}>Add child</button>
            <div>
              <div>
                PL:{' '}
                {[...arrify(item.fieldsLocal.parents)]
                  .map(x => `[${x.substring(0, 6)}] `)
                  .join()}
                | PC:{' '}
                {[...arrify(item.fieldsCentral.parents)]
                  .map(x => `[${x.substring(0, 6)}] `)
                  .join()}
              </div>
              <div>
                ChL:{' '}
                {[...arrify(item.fieldsLocal.children)]
                  .map(x => `[${x.substring(0, 6)}] `)
                  .join()}
                | ChC:{' '}
                {[...arrify(item.fieldsCentral.children)]
                  .map(x => `[${x.substring(0, 6)}] `)
                  .join()}
              </div>
            </div>
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

function arrify(arr: any[] | undefined): any[] {
  if (!arr) {
    return [];
  }
  return arr;
}
