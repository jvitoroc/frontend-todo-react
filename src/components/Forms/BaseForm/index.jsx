import React from 'react';
import styles from './style.module.css';
import { Formik, Form } from 'formik';
import Card from '../../Card'
import Overlay from '../Overlay';
import ErrorMessage from '../ErrorMessage';
import {REGISTER_REQUEST, REGISTER_SUCCESS, LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_WITH_GOOGLE_REQUEST} from '../../../actions/session';

function BaseForm(props){
    let {after, children, state, initialValues, validate, onSubmit} = {...props};
    let index;
    
    switch(state){
        case REGISTER_REQUEST:
        case LOGIN_REQUEST:
        case LOGIN_WITH_GOOGLE_REQUEST:
            index = 0;
            break;
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:                                
            index = 1;
            break;
        default:
            index = -1;
    }

    return (
        <div className={styles.BaseForm}>
            <Overlay
                index={index}
            >
                <Card>
                    <Formik
                        initialValues={initialValues}
                        validate={validate}
                        onSubmit={onSubmit}
                    >
                        {(formProps) => {
                            return (
                                <Form>
                                    <ErrorMessage message={formProps.errors['*']}/>
                                    {children(formProps)}
                                </Form>
                            )
                        }}
                    </Formik>
                    <div className={styles["after-wrapper"]}>
                        {after ? after:null}
                    </div>
                </Card>
            </Overlay>
        </div>
    );
}

export default BaseForm;