import { Reducer } from 'redux';
import { ActionTypes, Actions } from './actions';
import {CommanderState} from "./model";

const initialState: CommanderState = {
    command: '',
};

const reducer: Reducer<CommanderState, Actions> = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.SET_COMMAND:
            return {
                ...state,
                command: action.payload.command,
            };

        default:
            return state;
    }
};

export default reducer;
