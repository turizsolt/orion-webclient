import React, {
    useCallback,
    useContext,
  } from 'react';
  import { useSelector } from 'react-redux';
  import { RootState } from '../../../ReduxStore';
  import { Actions } from '../../../LocalStore/Actions';
  import { ActionsContext } from '../../../App';

  export const Filter: React.FC = () => {
    const { filters } = useSelector(
      (state: RootState) => state.appReducer
    );
  
    const actions: Actions = useContext(ActionsContext);
  
    const handleToggleFilter = useCallback(
      (filterId: string) => () => {
        actions.toggleFilter(filterId);
      },
      [actions]
    );

    return (
      <>
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
      </>
    );
  };
  