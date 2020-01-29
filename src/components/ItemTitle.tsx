import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StoredItem, Item } from '../store/state/Item';
import {
  updateItem,
  createItem,
  createRelation,
  selectItem
} from '../store/actions';
import { ActualIdGenerator } from '../idGenerator/ActualIdGenerator';
import { Change } from '../store/state/Change';
import { RootState } from '../store';

interface Props {
  item: StoredItem;
  title: string;
}

const idGenerator = new ActualIdGenerator();

export const ItemTitle: React.FC<Props> = props => {
  const { item, title } = props;

  const inputRef = useRef(null);

  const [edit, setEdit] = useState(false);
  const [focused, setFocused] = useState(false);
  const [firstFocus, setFirstFocus] = useState(true);

  const selectedItemId = useSelector(
    (state: RootState) => state.appReducer.selectedItemId
  );

  useEffect(() => {
    if (edit && !focused) {
      (inputRef.current as any).focus();
      setFirstFocus(false);
    }

    if (!edit && !focused && item.id === selectedItemId) {
      setEdit(true);
      setTitleValue(title);
      setFirstFocus(false);
    }
  }, [edit, firstFocus, item, title, focused, selectedItemId]);

  const [titleValue, setTitleValue] = useState(title);

  const dispatch = useDispatch();

  const handleEditOpen = useCallback(() => {
    setEdit(true);
    setTitleValue(title);
  }, [title]);

  const handleEditEnter = useCallback(
    (event: any) => {
      if (event.which === 11111) {
        setEdit(false);

        if (item.fieldsCentral.title === event.target.value) return;

        const change: Change = {
          type: 'UpdateItem',
          id: idGenerator.generate(),
          data: {
            itemId: item.id,
            field: 'title',
            oldValue: item.fieldsCentral.title,
            newValue: event.target.value
          }
        };
        dispatch(updateItem.started(change));
      }

      if (event.which === 13) {
        setEdit(false);

        if (item.fieldsCentral.title !== event.target.value) {
          const change: Change = {
            type: 'UpdateItem',
            id: idGenerator.generate(),
            data: {
              itemId: item.id,
              field: 'title',
              oldValue: item.fieldsCentral.title,
              newValue: event.target.value
            }
          };
          dispatch(updateItem.started(change));
        }

        let newParent = null;

        if (event.shiftKey) {
          newParent = item.id;
        } else if (
          item.fieldsCentral.parents &&
          item.fieldsCentral.parents.length > 0
        ) {
          newParent = item.fieldsCentral.parents[0];
        }

        const genId = idGenerator.generate();

        const itemx: Item = {
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
            parentId: newParent,
            childId: genId
          }
        };

        dispatch(createItem.started(change));
        if (newParent) {
          dispatch(createRelation.started(change2));
        }
        dispatch(selectItem({ id: genId }));
      }
    },
    [dispatch, item]
  );

  const handleEditFocus = useCallback(() => {
    setFocused(true);
  }, []);

  const handleEditBlur = useCallback(
    (event: any) => {
      setEdit(false);
      setFocused(false);

      if (item.fieldsCentral.title === event.target.value) return;

      const change: Change = {
        type: 'UpdateItem',
        id: idGenerator.generate(),
        data: {
          itemId: item.id,
          field: 'title',
          oldValue: item.fieldsCentral.title,
          newValue: event.target.value
        }
      };
      dispatch(updateItem.started(change));
    },
    [dispatch, item]
  );

  const handleEditChange = useCallback((event: any) => {
    setTitleValue(event.target.value);
  }, []);

  return (
    <>
      {!edit && (
        <div
          style={{ flexGrow: 1, height: '1em', border: '1px dotted gray' }}
          onClick={handleEditOpen}
        >
          <b>{title}</b>
        </div>
      )}
      {edit && (
        <input
          style={{
            flex: 1,
            minWidth: 0
          }}
          ref={inputRef}
          type="text"
          value={titleValue}
          onChange={handleEditChange}
          onKeyUp={handleEditEnter}
          onFocus={handleEditFocus}
          onBlur={handleEditBlur}
        />
      )}
    </>
  );
};
