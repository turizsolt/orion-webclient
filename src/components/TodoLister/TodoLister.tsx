import React from 'react';
import {Props} from "./interfaces";
import {Todo} from "../Todo";

export const TodoLister: React.FC<Props> = (props:Props) => {

    return (
        <div>
            { props.list.map(todo => <Todo todo={todo} />)}
        </div>
    );
};
