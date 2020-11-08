import React, { Component } from 'react';
import classes from './style.module.css';
import AnimateHeight from 'react-animate-height';

class ErrorMessage extends Component {
    componentWillUpdate({message}){
        if(message !== undefined)
            this.lastMessage = message;
    }

    render() { 
        return (
            <AnimateHeight
                className={this.props.className}
                duration={200}
                height={this.props.message === undefined ? 0:'auto'}
            >
                <div className={classes["error-message"]}>{this.lastMessage}</div>
            </AnimateHeight>
        );
    }
}

export default ErrorMessage;