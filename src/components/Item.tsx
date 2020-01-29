import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ItemId, StoredItem, Item as ItemX } from '../store/state/Item';
import { RootState } from '../store';
import {
  selectItem,
  createItem,
  createRelation,
  focusItem
} from '../store/actions';
import { ActualIdGenerator } from '../idGenerator/ActualIdGenerator';
import { Change } from '../store/state/Change';
import { ItemTitle } from './ItemTitle';
import { ChangeMarker } from './ChangeMarker';

interface Props {
  item: StoredItem;
  level: number;
}

const idGenerator = new ActualIdGenerator();

export const Item: React.FC<Props> = props => {
  const { item, level } = props;

  const [open, setOpen] = useState(true);

  const selectedItem = useSelector(
    (state: RootState) => state.appReducer.selectedItem
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
      dispatch(focusItem({ id: genId }));
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

  let levelString = 'grandchild';
  if (level === 0) levelString = 'parent';
  if (level === 1) levelString = 'child';

  const states: Record<string, string> = {
    todo: 'T',
    doing: 'O',
    done: 'D'
  };

  return (
    <>
      {!item && <div>UNDEFINED</div>}
      {item && (
        <>
          <div
            className={`task ${levelString}`}
            onClick={handleSelect(item.id)}
            style={{
              border:
                selectedItem.selectedId === item.id ? '2px solid blue' : 'none'
            }}
          >
            <div className="line1">
              <div className="opener" onClick={handleToggleOpen}>
                {children.length > 0 ? (open ? '-' : '+') : ''}
              </div>
              <div className="doneness">
                <ChangeMarker changed={!!item.fieldsLocal.state} />
                {states[item.fieldsLocal.state || item.fieldsCentral.state]}
              </div>
              <div className="name">
                {' '}
                <ChangeMarker changed={!!item.fieldsLocal.title} />
                <ItemTitle
                  item={item}
                  title={item.fieldsLocal.title || item.fieldsCentral.title}
                />
              </div>
              <div className="deadline">szerda</div>
              <div className="responsible">A</div>
              <div className="select"></div>

              <div className="addChild" onClick={handleAddChild(item.id)}>
                +
              </div>
            </div>
            <div className="line2">
              <div className="tags">#jurta #obi</div>
              <div className="ID">{item.id.substring(0, 6)}</div>
            </div>
          </div>
          {open && (
            <div style={{ marginLeft: '20px' }}>
              {children.map((child: ItemId) => (
                <Item key={child} item={items.byId[child]} level={level + 1} />
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
