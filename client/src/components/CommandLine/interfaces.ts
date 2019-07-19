import {Todo} from "../../store/model";

export interface OwnProps {
}

export interface StateProps {
    command: string;
    todo: Todo | null;
    todos: Todo[];
}

export interface DispatchProps {
    onExecCommand: (command: string) => void;
}

export type Props = OwnProps & StateProps & DispatchProps;
