import React, { Component } from 'react';
import { Field } from 'formik';
import ErrorMessage from '../ErrorMessage';
import classes from './style.module.css';

class InputText extends Component {
    static defaultProps = {
        password: false
    };

    componentWillUpdate({error}){
        if(error !== undefined)
            this.lastErrorMessage = error;
    }

    render() { 
        let {name, label, value, error, password} = {...this.props};
        let inputClasses = classes['input'] 
        inputClasses += (value === "" ? ' ' + classes["empty"]:"")
        inputClasses += (error ? ' ' + classes["error"]:"")
        
        return (
            <div className={classes.InputText}>
                <Field id={name} className={inputClasses} type={password ? "password":"text"} name={name}/>
                <label className={classes["label"]} htmlFor={name}>{label}</label>
                <ErrorMessage message={error}/>
                <div className={classes['gap']}></div>
            </div>
        );
    }
}

export default InputText;