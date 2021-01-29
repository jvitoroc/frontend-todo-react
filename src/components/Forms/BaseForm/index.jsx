import React from 'react';
import styles from './style.module.css';
import { Formik, Form } from 'formik';
import GoogleLogin from 'react-google-login';
import Overlay from '../Overlay';
import ErrorMessage from '../ErrorMessage';

function BaseForm(props){
    let {after, children, state, initialValues, validate, onSubmit} = {...props};
    let index;
    
    switch(state){
        case 'REGISTER_REQUEST': case 'LOGIN_REQUEST': index = 0; break;
        case 'REGISTER_SUCCESS':case 'LOGIN_SUCCESS': index = 1; break;
        default: index = -1;
    }

    function responseGoogle(res){
        console.log(res);
    }

    return (
        <div className={styles.BaseForm}>
            <Overlay
                className={styles["form-wrapper"]}
                index={index}
            >
                <div className={styles.logo}/>
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
                {after ? after:null}
                <div class={styles.alternative}>
                    <GoogleLogin
                        clientId="1011200848629-n2s30r353k7hvgk9k73bsj20b911omvv.apps.googleusercontent.com"
                        buttonText="Sign in with Google"
                        onSuccess={responseGoogle}
                        onFailure={responseGoogle}
                        cookiePolicy={'single_host_origin'}
                    />
                </div>
            </Overlay>
        </div>
    );
}

export default BaseForm;