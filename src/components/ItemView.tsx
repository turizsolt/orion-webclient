import React, {ChangeEvent, useCallback, useState} from 'react';
import {style} from "typestyle";
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

  const handleCheckChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
          setDone(e.target.checked);
      },
      [],
  );

  return (
      <div className={container}>
        <div>
          <input type="checkbox" onChange={handleCheckChange} />
          <StrikeThrough through={done}>{item.name}</StrikeThrough>
        </div>
        {item.items && <div className={itemsContainer}>
            <ItemsView items={item.items} />
        </div>}
      </div>
  );
};
