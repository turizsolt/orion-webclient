import React from 'react';

interface Props {
  changed: boolean;
}

export const ChangeMarker: React.FC<Props> = props => {
  return (
    <div>
      {props.changed && (
        <span
          style={{
            marginRight: '10px',
            display: 'inline-block',
            width: '10px',
            height: '10px',
            borderRadius: '5px',
            backgroundColor: 'red'
          }}
        />
      )}
    </div>
  );
};
