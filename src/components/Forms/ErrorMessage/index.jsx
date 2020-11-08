import React, { useRef, useEffect } from 'react';
import classes from './style.module.css';
import AnimateHeight from 'react-animate-height';

function ErrorMessage(props){
    const lastMessageRef = useRef(null);

    if(props.message)
        lastMessageRef.current = props.message;

    return (
        <AnimateHeight
            className={props.className}
            duration={200}
            height={props.message === undefined ? 0:'auto'}
        >
            <div className={classes["error-message"]}>{lastMessageRef.current}</div>
        </AnimateHeight>
    );
}

export default ErrorMessage;