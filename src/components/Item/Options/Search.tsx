import React, {
    useCallback,
    useContext,
    KeyboardEvent,
  } from 'react';
  import { useSelector } from 'react-redux';
  import { RootState } from '../../../ReduxStore';
  import { Actions } from '../../../LocalStore/Actions';
  import { ActionsContext } from '../../../App';
import { style } from 'typestyle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons'


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

    const inputStyle = style({
      border: 'none',
      borderBottom: '2px solid #bee3db',
      padding: '10px',
      backgroundColor: '#555b6e',
      //color: '#faf9f9'
    });

    return (<>
        <div className={inputStyle}><FontAwesomeIcon icon={faSearch} /></div>
        <div>          
          <input className={inputStyle} type="text" defaultValue={search} onKeyUp={handleSearch} placeholder="Search..." />
        </div>
        </>
    );
  };
  