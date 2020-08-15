import React, { Component } from 'react';
import { Field } from 'formik';
import classes from './style.module.css';
import AnimateHeight from 'react-animate-height';

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
                <AnimateHeight
                    duration={200}
                    height={error === undefined ? 0:'auto'}
                >
                    <div className={classes["error-message"]}>{this.lastErrorMessage}</div>
                    {/* <ErrorMessage name={name} className={classes["error-message"]} component="div"/> */}
                </AnimateHeight>
                <div className={classes['gap']}></div>
            </div>
        );
    }
}

export default InputText;