import {Todo} from "../../store/model";

export interface OwnProps {
}

export interface StateProps {
    todo: Todo;
    onExecCommand: (command: string) => void;
}

export interface DispatchProps {
}

export type Props = OwnProps & StateProps & DispatchProps;
