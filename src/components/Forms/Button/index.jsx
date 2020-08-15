import React, { Component } from 'react';
import classes from './style.module.css';

class Button extends Component {
    render() { 
        return (
            <input {...this.props} className={classes["button"]} type="submit"/>
        );
    }
}

export default Button;