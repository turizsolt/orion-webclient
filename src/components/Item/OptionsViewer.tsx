import React from 'react';
import { style } from 'typestyle';
import { Search } from './Options/Search';
import { Order } from './Options/Order';
import { Filter } from './Options/Filter';

const sideStyle = style({
  minWidth: '160px',
  minHeight: '50px',
  backgroundColor: '#bcd2d3',
  marginLeft: '10px',
  marginBottom: '10px'
});

export const OptionsViewer: React.FC = () => {
  return (
    <div className={sideStyle}>
      <Search />
      <Order />
      <Filter />
    </div>
  );
};
