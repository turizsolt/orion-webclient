import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Item } from '../store/state/Item';
import { Change } from '../store/state/Change';
import { createItem } from '../store/actions';
import { ActualIdGenerator } from '../idGenerator/ActualIdGenerator';

const idGenerator = new ActualIdGenerator();

export const ItemAdder: React.FC = () => {
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');

  const handleChange = React.useCallback((event: any) => {
    setTitle(event.target.value);
  }, []);

  const handleAddChildren = React.useCallback(() => {
    const item: Item = {
      id: idGenerator.generate(),
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
  }, [dispatch, title]);

  return (
    <>
      <div>
        <input type="text" value={title} onChange={handleChange} />
        <button onClick={handleAddChildren}>Add children</button>
      </div>
    </>
  );
};
