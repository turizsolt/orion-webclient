import { MapDispatchToProps, MapStateToProps, connect } from 'react-redux';
import { DispatchProps, OwnProps, StateProps } from './interfaces';
import {setCommand} from "../../store";
import {CommandLine} from "./CommandLine";
import {AppState} from "../../App";

const mapStateToProps: MapStateToProps<StateProps, OwnProps, AppState> = (state) => {
    return ({
        ...state.command
    });
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch) => {
    return {
        onExecCommand: (command: string) => dispatch(setCommand({ command })),
    };
};

export const CommandLineContainer = connect<StateProps, DispatchProps, OwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps,
)(CommandLine);
