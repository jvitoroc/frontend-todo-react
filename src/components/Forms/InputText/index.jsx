import React from 'react';
import { Field } from 'formik';
import classnames from 'classnames';
import ErrorMessage from '../ErrorMessage';
import styles from './style.module.css';

function InputText(props = {password: false}){
    let {name, label, value, error, password} = {...props};
    let inputClasses = classnames(
        styles.input,
        {[styles.empty]: value === ""},
        {[styles.error]: error}
    );
    
    return (
        <div className={styles.InputText}>
            <Field id={name} className={inputClasses} type={password ? "password":"text"} name={name}/>
            <label className={styles.label} htmlFor={name}>{label}</label>
            <ErrorMessage message={error}/>
            <div className={styles.label}></div>
        </div> 
    );
}

export default InputText;