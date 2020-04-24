import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Item as ItemTsx } from './Item';

interface Props {
  id: string;
}

export const ItemWrapper: React.FC<Props> = (props: Props) => {
  const { id } = props;
  const { byId: items } = useSelector(
    (state: RootState) => state.appReducer.items
  );

  return (
    <>
      <ItemTsx item={items[id]} key={id} level={0} parentId={null} />
    </>
  );
};
