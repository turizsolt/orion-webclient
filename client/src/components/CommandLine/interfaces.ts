export interface OwnProps {
}

export interface StateProps {
    command: string;
}

export interface DispatchProps {
    onExecCommand: (command: string) => void;
}

export type Props = OwnProps & StateProps & DispatchProps;
