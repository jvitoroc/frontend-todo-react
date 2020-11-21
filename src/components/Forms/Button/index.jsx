import React from 'react';
import styles from './style.module.css';

function Button(props){
    return (
        <input {...props} className={styles.button} type="submit"/>
    );
}

export default Button;