import {Action} from "redux";
import { createAction } from 'redux-actions';

export enum ActionTypes {
    SET_COMMAND = '@@command/SET_COMMAND',
}

export interface SetCommandAction extends Action<ActionTypes.SET_COMMAND> {
    payload: {command: string};
}

export type Actions = SetCommandAction;

export const setCommand = createAction<SetCommandAction['payload'], SetCommandAction['payload']>(
    ActionTypes.SET_COMMAND,
    x => x,
);
