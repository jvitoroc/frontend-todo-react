import React, { useRef } from 'react';
import styles from './style.module.css';
import AnimateHeight from 'react-animate-height';

function ErrorMessage(props){
    const lastMessageRef = useRef(null);

    if(props.message)
        lastMessageRef.current = props.message;

    return (
        <AnimateHeight
            className={styles["error-message-wrapper"]}
            duration={200}
            height={props.message === undefined ? 0:'auto'}
        >
            <div className={styles["error-message"]}>{lastMessageRef.current}</div>
        </AnimateHeight>
    );
}

export default ErrorMessage;