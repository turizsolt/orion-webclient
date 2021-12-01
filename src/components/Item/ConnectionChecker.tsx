import React, { useCallback, useContext, useState } from 'react';
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

    const fn = (value: {time: number, message: string}):string => {
        const timeStr = (new Date(value.time)).toUTCString();
        return timeStr + ': ' + value.message;
    };

    const textAll = lastAlive.map(fn);
    const text = lastAlive.length < 1 ? 'no logs yet' : textAll[0];
    
    const [show, setShow] = useState(false);

    const handlePing = useCallback(() => {
        actions.ping();
    }, [actions]);
    
    const handleShow = useCallback(() => {
        setShow(!show);
    }, [show]);

    const handleReconnect = useCallback(() => {
        actions.reconnect();
    }, [actions]);

    return (
        <div className={checkerStyle} style={{backgroundColor: 'green'}}>
            {text}
            <button onClick={handlePing}>Ping</button>
            <button onClick={handleReconnect}>reConn</button>
            <button onClick={handleShow}>Show</button>
            {show && <>
                <hr />
                {textAll.map((t:string, ind:number) => <div key={ind}>{t}</div>)}
            </>}
        </div>
    );
};
