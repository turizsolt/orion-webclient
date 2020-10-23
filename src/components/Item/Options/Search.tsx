import React, {
    useCallback,
    useContext,
    KeyboardEvent,
  } from 'react';
  import { useSelector } from 'react-redux';
  import { RootState } from '../../../ReduxStore';
  import { Actions } from '../../../LocalStore/Actions';
  import { ActionsContext } from '../../../App';


  export const Search: React.FC = () => {
    const { search } = useSelector(
      (state: RootState) => state.appReducer
    );
  
    const actions: Actions = useContext(ActionsContext);
  

    const handleSearch = useCallback(
      (event: KeyboardEvent<HTMLInputElement>) => {
        const searchString = event.currentTarget.value;
        actions.search(searchString);
      },
      [actions]
    );
  

    return (<>
        <div>Search</div>
        <div>
          <input type="text" defaultValue={search} onKeyUp={handleSearch} />
        </div>
        </>
    );
  };
  