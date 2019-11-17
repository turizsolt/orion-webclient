import React, {ChangeEvent, useCallback, useContext} from 'react';
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

  return (
      <div className={container}>
        <div style={{ display: 'flex' }}>
            <input type="checkbox" onChange={handleCheckChange} checked={done} />
            <StrikeThrough through={done}>{item.name}</StrikeThrough>
            {!item.items && <div onClick={handleAddItems}>(+)</div>}
            <div onClick={handleDelete}>(X)</div>
        </div>
        {item.items && <div className={itemsContainer}>
            <ItemsView items={item.items} parentId={item.id} />
        </div>}
      </div>
  );
};
