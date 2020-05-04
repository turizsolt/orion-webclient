import React from 'react';
import { style } from 'typestyle';
import { Updateness } from '../../model/Updateness';

interface Props {
  symbol: Updateness;
}

const dotStyle = style({
  width: '18px',
  height: '14px',
  paddingTop: '4px',
  marginRight: '5px',
  borderRadius: '50%',
  textAlign: 'center',
  fontSize: '10px'
});

const symbols: Record<Updateness, { color: string; sign: string }> = {
  [Updateness.Conflict]: { color: 'yellow', sign: '!' },
  [Updateness.Resolved]: { color: 'purple', sign: 'R' },
  [Updateness.Local]: { color: 'blue', sign: 'L' },
  [Updateness.GoneLocal]: { color: 'blue', sign: 'G' },
  [Updateness.Editing]: { color: 'white', sign: 'E' },
  [Updateness.JustUpdated]: { color: 'lime', sign: 'K' },
  [Updateness.UpToDate]: { color: 'inherit', sign: '' }
};

export const StateDot: React.FC<Props> = props => {
  const { symbol } = props;

  return (
    <div
      className={dotStyle}
      style={{ backgroundColor: symbols[symbol].color }}
    >
      {symbols[symbol].sign}
    </div>
  );
};
