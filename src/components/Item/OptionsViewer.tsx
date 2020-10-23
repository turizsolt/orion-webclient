import React from 'react';
import { style } from 'typestyle';
import { Order } from './Options/Order';
import { Filter } from './Options/Filter';

const sideStyle = style({
  minWidth: '160px',
  minHeight: '50px',
  backgroundColor: 'var(--main-color)',
  marginLeft: '10px',
  marginBottom: '10px',
  padding: '10px'
});

export const OptionsViewer: React.FC = () => {
  return (
    <div className={sideStyle}>
      <Order />
      <Filter />
    </div>
  );
};
