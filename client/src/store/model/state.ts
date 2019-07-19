import {Todo} from "./todo";

export interface CommanderState {
    command: string;
    todo: Todo | null;
    todos: Todo[];
}
