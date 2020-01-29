import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Item } from '../store/state/Item';
import { Change } from '../store/state/Change';
import { createItem, focusItem } from '../store/actions';
import { ActualIdGenerator } from '../idGenerator/ActualIdGenerator';

const idGenerator = new ActualIdGenerator();

export const ItemAdder: React.FC = () => {
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');

  const handleAddChildren = React.useCallback(() => {
    // if (title === '') return;

    const genId = idGenerator.generate();
    const item: Item = {
      id: genId,
      fields: {
        title,
        createdAt: new Date().toISOString(),
        description: '',
        state: 'todo'
      }
    };

    const change: Change = {
      type: 'CreateItem',
      id: idGenerator.generate(),
      data: {
        item
      }
    };

    dispatch(createItem.started(change));
    dispatch(focusItem({ id: genId }));
    setTitle('');
  }, [dispatch, title]);

  const handleChange = React.useCallback((event: any) => {
    setTitle(event.target.value);
  }, []);

  const handleEnter = React.useCallback(
    (event: any) => {
      if (event.which === 13) {
        handleAddChildren();
      }
    },
    [handleAddChildren]
  );

  return (
    <>
      <div>
        {false && (
          <input
            type="text"
            value={title}
            onKeyUp={handleEnter}
            onChange={handleChange}
          />
        )}
        <button onClick={handleAddChildren}>Add root item</button>
      </div>
    </>
  );
};
