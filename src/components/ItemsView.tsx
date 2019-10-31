import React from 'react';
import {style} from "typestyle";
import {Item} from "../interfaces";
import {ItemView} from "./ItemView";

const container = style({});

interface Props {
  items: Item[];
}

export const ItemsView: React.FC<Props> = (props) => {
  const { items } = props;

  return (
      <div className={container}>
        {items.map((item, idx) => (
            <ItemView key={idx} item={item} />
        ))}
      </div>
  );
};
