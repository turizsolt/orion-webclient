import React from 'react';
import { useSelector } from 'react-redux';
import { style } from 'typestyle';
import { RootState } from '../../ReduxStore';

const sideStyle = style({
  width: '160px',
  minHeight: '50px',
  backgroundColor: '#bcd2d3',
  marginLeft: '10px',
  marginBottom: '10px'
});

export const OptionsViewer: React.FC = () => {
  const { version } = useSelector((state: RootState) => state.appReducer);

  return (
    <div className={sideStyle}>
      <div>Keresés {version}</div>
      <div>Rendezés</div>
      <div>Szűrők</div>
    </div>
  );
};
