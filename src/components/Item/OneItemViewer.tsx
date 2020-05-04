import React from 'react';
import { ItemViewer } from './ItemViewer';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';

export const OneItemViewer: React.FC = () => {
  const { id } = useParams();
  const { items } = useSelector((state: any) => state.appReducer);

  return <div>{id && <ItemViewer item={items[id]} />}</div>;
};
