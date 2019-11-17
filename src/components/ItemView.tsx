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

  const [done, setDone] = useState(false);

  const { dispatch } = useContext(ProjectContext);

  const handleCheckChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
          setDone(e.target.checked);
      },
      [],
  );

  const handleAddItems = useCallback(
      () => {
          dispatch({type: 'ADD_CHILDREN', payload: { id: item.id }});
      },
      [dispatch, item],
  );

  return (
      <div className={container}>
        <div style={{ display: 'flex' }}>
            <input type="checkbox" onChange={handleCheckChange} />
            <StrikeThrough through={done}>{item.name}</StrikeThrough>
            {!item.items && <div onClick={handleAddItems}>(+)</div>}
        </div>
        {item.items && <div className={itemsContainer}>
            <ItemsView items={item.items} parentId={item.id} />
        </div>}
      </div>
  );
};
