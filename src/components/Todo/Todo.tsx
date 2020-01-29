import React from 'react';
import {Props} from "./interfaces";

export const Todo: React.FC<Props> = (props:Props) => {

    return (
        <div>
            {props.todo.description}
        </div>
    );
};
