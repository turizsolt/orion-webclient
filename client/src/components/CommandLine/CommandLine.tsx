import * as React from "react";
import {Props} from "./interfaces";

export const CommandLine: React.FC<Props> = (props) => {

    const { command, onExecCommand } = props;

    const handleChange = (event: any) => {
        if (event.keyCode === 13) {
            console.log('enter');
            onExecCommand(event.target.value);
            event.target.value = '';
        }
        if (event.keyCode === 8) {
            console.log('backspace');
        }
        if (event.keyCode === 9) {
            console.log('tab');
        }
        if (event.keyCode === 39) {
            console.log('right');
        }
        if (event.keyCode === 32) {
            console.log('space');
        }
    };

    return (
        <div style={{ margin: '20px' }}>
            <input onKeyUp={handleChange} />
            <div>{command}</div>
        </div>

    );
};
