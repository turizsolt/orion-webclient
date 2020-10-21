import React, { useCallback, useContext } from 'react';
import { useSelector } from 'react-redux';
import { style } from 'typestyle';
import { RootState } from '../../ReduxStore';
import { Actions } from '../../LocalStore/Actions';
import { ActionsContext } from '../../App';

const sideStyle = style({
  minWidth: '160px',
  minHeight: '50px',
  backgroundColor: '#bcd2d3',
  marginLeft: '10px',
  marginBottom: '10px'
});

export const OptionsViewer: React.FC = () => {
  const { filters } = useSelector((state: RootState) => state.appReducer);

  const actions: Actions = useContext(ActionsContext);

  const handleToggleFilter = useCallback(
    (filterId: string) => () => {
      actions.toggleFilter(filterId);
    },
    [actions]
  );

  return (
    <div className={sideStyle}>
      <div>Search</div>
      <div>Order</div>
      <div>Filters</div>
      <div>
        {filters.map(filter => (
          <div key={filter.id}>
            <input
              type="checkbox"
              checked={filter.on}
              onChange={handleToggleFilter(filter.id)}
            />
            {filter.name}
          </div>
        ))}
      </div>
    </div>
  );
};
