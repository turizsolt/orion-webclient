import {Action} from "redux";
import { createAction } from 'redux-actions';

export enum ActionTypes {
    SET_COMMAND = '@@command/SET_COMMAND',
}

export interface SetCommand extends Action<ActionTypes.SET_COMMAND> {
    payload: {command: string};
}

export type Actions = SetCommand;

export const createVariable = createAction<SetCommand['payload'], SetCommand['payload']>(
    ActionTypes.SET_COMMAND,
    x => x,
);
