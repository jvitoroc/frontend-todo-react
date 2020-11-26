import React from 'react';
import styles from './style.module.css';
import Ripples from 'react-ripples';

function Button(props){
    return (
        <Ripples className={styles.ripples}>
            <input {...props} className={styles.button} type="submit"/>
        </Ripples>
    );
}

export default Button;