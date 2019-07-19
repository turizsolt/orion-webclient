import { Reducer } from 'redux';
import { ActionTypes, Actions } from './actions';
import {CommanderState} from "./model";

const initialState: CommanderState = {
    command: '',
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
            };

        case ActionTypes.LIST_TODO:
            return {
                ...state,
                todos: action.payload.todos,
            };

        default:
            return state;
    }
};

export default reducer;
