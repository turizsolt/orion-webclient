import React, { useCallback, useContext } from 'react';
import { style } from 'typestyle';
import { Actions } from '../../LocalStore/Actions';
import { ActionsContext } from '../../App';
import { useSelector } from 'react-redux';

const checkerStyle = style({
    margin: 0,
    marginBottom: '10px',
    padding: 0,
    border: 0,
    textAlign: 'center',
    width: '100%'
});

export const ConnectionChecker: React.FC = () => {

    const actions: Actions = useContext(ActionsContext);

    const {lastAlive} = useSelector(
        (state: any) => state.appReducer
    );
    
    const now = (new Date()).getTime();
    const online = lastAlive + 15000 > now;
    const last = (new Date(lastAlive)).toUTCString();

    const handleCheck = useCallback(() => {
        actions.ping();
    }, [actions]);
    
    return (
        <div className={checkerStyle} style={{backgroundColor: online ? 'lime' : 'red'}}>
            {last}
            <button onClick={handleCheck}>Check</button>
        </div>
    );
};
