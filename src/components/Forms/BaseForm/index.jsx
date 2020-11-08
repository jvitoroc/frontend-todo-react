import React, { Component } from 'react';
import classes from './style.module.css';
import { Formik, Form } from 'formik';
import Overlay from '../Overlay';
import ErrorMessage from '../ErrorMessage';

class BaseForm extends Component {
    render() { 
        let {after, children, state, initialValues, validate, onSubmit} = {...this.props};
        let index;
        
        switch(state){
            case 'LOADING': index = 0; break;
            case 'SUCCESS': index = 1; break;
            default: index = -1;
        }

        return (
            <div className={classes.BaseForm}>
                <Overlay
                    className={classes["form-wrapper"]}
                    index={index}
                >
                    <div className={classes["logo"]}/>
                    <Formik
                        initialValues={initialValues}
                        validate={validate}
                        onSubmit={onSubmit}
                    >
                        {(formProps) => {
                            return (
                                <Form>
                                    <ErrorMessage className={classes['error-message']} message={formProps.errors['*']}/>
                                    {children(formProps)}
                                </Form>
                            )
                        }}
                    </Formik>
                    {after ? after:null}
                </Overlay>
            </div>
        );
    }
}

export default BaseForm;