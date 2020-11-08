import React from 'react';
import { Field } from 'formik';
import ErrorMessage from '../ErrorMessage';
import classes from './style.module.css';

function InputText(props = {password: false}){
    let {name, label, value, error, password} = {...props};
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

export default InputText;