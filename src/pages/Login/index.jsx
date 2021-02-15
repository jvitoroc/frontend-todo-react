import React from 'react';
import styles from '../../components/Forms/common.module.css';
import BaseForm from '../../components/Forms/BaseForm';
import Button from '../../components/Forms/Button';
import InputText from '../../components/Forms/InputText';
import GoogleLoginButton from '../../components/GoogleLoginButton';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { loginRequest, loginWithGoogleRequest } from '../../actions/session';

function Login(props){
    const handleSubmit = (values, { setSubmitting, setErrors })=>{
        props.loginRequest(values.username, values.password, setSubmitting, setErrors);
    }

    const validateForm = (values)=>{
        const errors = {};
        if (!values.username)
            errors.username = 'Username is required.';

        if (!values.password)
            errors.password = 'Password is required.';

        return errors;
    }

    const onGoogleResponse = (response)=>{
        props.loginWithGoogleRequest(response.getAuthResponse().id_token);
    }

    let after = (
        <>
            <Link className={styles.link} to={'/signup'}>Create an account</Link>
            <GoogleLoginButton buttonText={"Sign in with Google"} onResponse={onGoogleResponse}/>
        </>
    )
    
    return (
        <BaseForm
            initialValues={{ username: '', password: '', repeatPassword: '', '*': '' }}
            validate={validateForm}
            onSubmit={handleSubmit}
            state={props.user.currentState}
            after={after}
        >
            {({ isSubmitting, errors, values })=>{
                return (
                    <>
                        <InputText name={'username'} label={'Username'} value={values.username} error={errors.username}/>
                        <InputText name={'password'} label={'Password'}  value={values.password} error={errors.password} password/>
                        <Button disabled={isSubmitting} type="submit" value="Log in"/>
                    </>
                )
            }}
        </BaseForm>
    );
}

const mapStateToProps = (state) => {
    return {...state};
}

const mapDispatchToProps = dispatch => {
    return {
        loginRequest: (username, password, setSubmitting, setErrors) => {
            dispatch(loginRequest(username, password, setSubmitting, setErrors));
        },
        loginWithGoogleRequest: (idToken) => {
            dispatch(loginWithGoogleRequest(idToken));
        }
    };
}

const ConnectedLogin = connect(mapStateToProps, mapDispatchToProps)(Login);

export default ConnectedLogin;