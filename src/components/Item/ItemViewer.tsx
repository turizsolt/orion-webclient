import React from 'react';
import { TextFieldViewer } from './TextFieldViewer';
import { ViewItem } from '../../model/Item/ViewItem';

interface Props {
  item: ViewItem;
}

export const ItemViewer: React.FC<Props> = props => {
  const { item } = props;
  console.log('item', item);
  return (
    <div>
      <div>{item.id}</div>
      {item.fields.map(field => (
        <TextFieldViewer key={field.name} id={item.id} {...field} />
      ))}
    </div>
  );
};
