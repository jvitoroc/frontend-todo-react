import React from 'react';
import classes from './style.module.css';

function Button(props){
    return (
        <input {...props} className={classes["button"]} type="submit"/>
    );
}

export default Button;