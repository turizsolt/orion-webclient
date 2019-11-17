import React, {FC} from 'react';
import {style} from "typestyle";
import {Item} from "../interfaces";
import {ItemAdder} from "./ItemAdder";
import {ItemView} from "./ItemView";

const container = style({});

interface Props {
  items: Item[];
  parentId: string;
}

export const ItemsView: FC<Props> = (props) => {
  const { items, parentId } = props;

  return (
      <div className={container}>
        {items.map(item => (
            <ItemView key={item.id} item={item} />
        ))}
        <ItemAdder parentId={parentId} />
      </div>
  );
};
