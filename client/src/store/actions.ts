import {Action} from "redux";
import { createAction } from 'redux-actions';
import {Todo} from "./model";

export enum ActionTypes {
    SET_COMMAND = '@@command/SET_COMMAND',
    GET_TODO = '@@todo/GET_TODO',
    LIST_TODO = '@@todo/LIST_TODO',
}

export interface SetCommandAction extends Action<ActionTypes.SET_COMMAND> {
    payload: {command: string};
}

export interface GetTodoAction extends Action<ActionTypes.GET_TODO> {
    payload: {todo: Todo};
}

export interface ListTodoAction extends Action<ActionTypes.LIST_TODO> {
    payload: {todos: Todo[]};
}

export type Actions = SetCommandAction | GetTodoAction | ListTodoAction;

export const setCommand = createAction<SetCommandAction['payload'], SetCommandAction['payload']>(
    ActionTypes.SET_COMMAND,
    x => x,
);

export const getTodo = createAction<GetTodoAction['payload'], GetTodoAction['payload']>(
    ActionTypes.GET_TODO,
    x => x,
);

export const listTodo = createAction<ListTodoAction['payload'], ListTodoAction['payload']>(
    ActionTypes.LIST_TODO,
    x => x,
);
