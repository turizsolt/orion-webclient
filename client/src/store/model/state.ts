import {Todo} from "./todo";

export interface CommanderState {
    command: string;
    view: 'list' | 'item';
    todo: Todo | null;
    todos: Todo[];
}
