import React from 'react';
import { ViewItem } from './ViewItem';
import { TextFieldViewer } from './TextFieldViewer';

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
