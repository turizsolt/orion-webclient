import * as React from "react";
import {Props} from "./interfaces";

export const TodoPreview: React.FC<Props> = (props) => {
    const { todo, onExecCommand } = props;

    return (
        <div style={{ display: 'flex', border: '1px solid black', alignItems: 'center' }} onClick={onExecCommand.bind(null, `get #${todo.id}`)}>
            <div style={{ width: '25px', textAlign: 'center' }}>{todo.doneAt?'✓':''}</div>
            <div style={{ width: '70px', fontSize: '75%', textAlign: 'center' }}>#{todo.id}</div>
            <div style={{ paddingLeft: '10px' }}>{todo.title}</div>
            {todo.epic && <div style={{ backgroundColor: 'lime', borderRadius: '0.5em', padding: '0.25em', margin: '0.25em', fontSize: '75%' }}>{todo.epic}</div>}
        </div>
    );
};
