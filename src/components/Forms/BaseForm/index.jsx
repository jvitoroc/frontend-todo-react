import React, { Component } from 'react';
import classes from './style.module.css';
import { Formik, Form } from 'formik';

class BaseForm extends Component {
    render() { 
        let {after, children, initialValues, validateForm, onSubmit} = {...this.props};

        return (
            <div className={classes.BaseForm}>
                <div className={classes["form-wrapper"]}>
                    <div className={classes["logo"]}/>
                    <Formik
                        initialValues={initialValues}
                        validate={validateForm}
                        onSubmit={onSubmit}
                    >
                        {(formProps) => {
                            console.log(formProps.errors["*"]);
                            return (
                                <Form>
                                    {/* <SwitchTransition>
                                        <CSSTransition
                                            key={formProps.errors["*"]}
                                            classNames={'alert'}
                                            in={formProps.errors["*"] !== undefined}
                                            unmountOnExit
                                            timeout={200}
                                        >
                                            <div className={classes['error-message']}>
                                                {formProps.errors["*"]}
                                            </div>
                                        </CSSTransition>
                                    </SwitchTransition> */}
                                    {children(formProps)}
                                </Form>
                            )
                        }}
                    </Formik>
                    {after ? after:null}
                </div>
            </div>
        );
    }
}

export default BaseForm;