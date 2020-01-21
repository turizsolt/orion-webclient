import React, {useEffect, useState} from 'react';
import {classes, keyframes, style} from "typestyle";

const strikeKeyframe = keyframes({
    from: {transform: 'scaleX(0)'},
    to: {transform: 'scaleX(1)'},
});

const span = style({
    display: 'inline-block',
    position: 'relative',
    '$nest': {
        '&:after': {
            content: "''",
            position: 'absolute',
            display: 'block',
            width: '100%',
            height: '1px',
            marginTop: '-0.5em',
            background: 'black',
            transformOrigin: 'center left',
        },
    },
});

const transition = style({
    transition: 'all 0.5s cubic-bezier(.55, 0, .1, 1)',
    '$nest': {
        '&:after': {
            transition: 'transform 0.5s cubic-bezier(.55, 0, .1, 1)',
            animation: `${strikeKeyframe} 1s 0.5s cubic-bezier(.55, 0, .1, 1) 1`,
            animationName: strikeKeyframe,
            animationPlayState: 'paused',
        },
    },
});

const strike = style({
    '$nest': {
        '&:after': {
            transformOrigin: 'center left',
            transform: 'scaleX(1)',
        },
    },
});

const normal = style({
    '$nest': {
        '&:after': {
            transform: 'scaleX(0)',
            transformOrigin: 'center right',
        },
    },
});

interface Props {
    through: boolean;
}

export const StrikeThrough: React.FC<Props> = (props) => {
    const { through, children } = props;

    const [ready, setReady] = useState(false);
    useEffect(
        () => {
            setTimeout(() => {setReady(true);},0);
        },
        [],
    );

    return (
        <span className={classes(span, through ? strike : normal, ready && transition)}>{children}</span>
    );
};
