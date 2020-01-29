import { Reducer } from 'redux';
import { ActionTypes, Actions } from './actions';
import {CommanderState} from "./model";

const initialState: CommanderState = {
    command: '',
    view: 'list',
    todo: null,
    todos: [],
};

const reducer: Reducer<CommanderState, Actions> = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.SET_COMMAND:
            return {
                ...state,
                command: action.payload.command,
            };

        case ActionTypes.GET_TODO:
            return {
                ...state,
                todo: action.payload.todo,
                view: 'item',
            };

        case ActionTypes.LIST_TODO:
            return {
                ...state,
                todos: action.payload.todos,
                view: 'list',
            };

        default:
            return state;
    }
};

export default reducer;
