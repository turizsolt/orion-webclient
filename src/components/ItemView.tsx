import React, {ChangeEvent, useCallback, useContext, useState} from 'react';
import {style} from "typestyle";
import {ProjectContext} from "../App";
import {Item} from "../interfaces";
import {ItemsView} from "./ItemsView";
import {StrikeThrough} from "./StrikeThrough";

const container = style({});

const itemsContainer = style({
    marginLeft: '20px',
});

interface Props {
  item: Item;
}

export const ItemView: React.FC<Props> = (props) => {
    const { item } = props;
    const done = item.state === 'done';
    const { dispatch } = useContext(ProjectContext);

    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(item.name);

    const handleCheckChange = useCallback(
          (e: ChangeEvent<HTMLInputElement>) => {
              dispatch({type: 'SET_STATE', payload: { id: item.id, state: e.target.checked ? 'done' : 'todo' }});
        },
        [dispatch, item],
    );

  const handleAddItems = useCallback(
      () => {
          dispatch({type: 'ADD_CHILDREN', payload: { id: item.id }});
      },
      [dispatch, item],
  );

  const handleDelete = useCallback(
      () => {
          dispatch({type: 'DELETE', payload: { id: item.id }});
      },
      [dispatch, item],
  );

  const handleStartEdit = useCallback(
      () => {
          setEditing(true);
      },
      [],
  );

    const handleEdit = useCallback(
        (event) => {
            setName(event.target.value);
        },
        [],
    );

    const handleEditEnter = useCallback(
        (event) => {
            if(event.which === 13) {
                dispatch({type: 'EDIT_NAME', payload: { id: item.id, name: event.target.value }});
                setEditing(false);
            }
        },
        [dispatch, item],
    );

    const handleEditBlur = useCallback(
        (event) => {
            dispatch({type: 'EDIT_NAME', payload: { id: item.id, name: event.target.value }});
            setEditing(false);
        },
        [dispatch, item],
    );

  return (
      <div className={container}>
        <div style={{ display: 'flex' }}>
            <input type="checkbox" onChange={handleCheckChange} checked={done} />
            {!editing && <div onClick={handleStartEdit}>
                <StrikeThrough through={done}>{item.name}</StrikeThrough>
            </div>}
            {editing && <input type="text" onChange={handleEdit} onKeyUp={handleEditEnter} onBlur={handleEditBlur} value={name} />}
            {!item.items && <div onClick={handleAddItems}>(+)</div>}
            <div onClick={handleDelete}>(X)</div>
        </div>
        {item.items && <div className={itemsContainer}>
            <ItemsView items={item.items} parentId={item.id} />
        </div>}
      </div>
  );
};
