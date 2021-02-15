import React from 'react';
import styles from '../../components/Forms/common.module.css';
import BaseForm from '../../components/Forms/BaseForm';
import Button from '../../components/Forms/Button';
import InputText from '../../components/Forms/InputText';
import GoogleLoginButton from '../../components/GoogleLoginButton';
import { Link, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerRequest, loginWithGoogleRequest } from '../../actions/session';

function Signup(props){
    let history = useHistory();
    
    const handleSubmit = (values, { setSubmitting, setErrors })=>{
        props.registerRequest(values.username, values.email, values.password, setSubmitting, setErrors, ()=>{
            history.push('/login');
        });
    };

    const validateForm = (values)=>{
        const errors = {};
        if (!values.username)
            errors.username = 'Username is required.';

        if (!values.password)
            errors.password = 'Password is required.';

        if (!values.email)
            errors.email = 'Email is required.';

        if (!values.repeatPassword)
            errors.repeatPassword = 'Confirm your password.';
        else if (values.password !== values.repeatPassword)
            errors.repeatPassword = "Passwords don't match.";

        if (!values.repeatEmail)
            errors.repeatEmail = 'Confirm your email.';
        else if (values.email !== values.repeatEmail)
            errors.repeatEmail = "Emails don't match.";

        return errors;
    }

    const onGoogleResponse = (response)=>{
        props.loginWithGoogleRequest(response.getAuthResponse().id_token);
    }

    let after = (
        <>
            <Link className={styles.link} to={'/login'}>Already have an account? Log in</Link>
            <GoogleLoginButton buttonText={"Sign up with Google"} onResponse={onGoogleResponse}/>
        </>
    )

    return (
        <BaseForm
            initialValues={{ username: '', email: '', repeatEmail: '', password: '', repeatPassword: '' }}
            validate={validateForm}
            onSubmit={handleSubmit}
            state={props.user.currentState}
            after={after}
        >
            {({ isSubmitting, errors, values })=>{
                return (
                    <>
                        <InputText name={'username'} label={'Username'} value={values.username} error={errors.username}/>
                        <InputText name={'email'} label={'Email'} value={values.email} error={errors.email}/>
                        <InputText name={'repeatEmail'} label={'Repeat email'} value={values.repeatEmail} error={errors.repeatEmail}/>
                        <InputText name={'password'} label={'Password'}  value={values.password} error={errors.password} password/>
                        <InputText name={'repeatPassword'} label={'Repeat password'}  value={values.repeatPassword} error={errors.repeatPassword} password/>
                        <Button disabled={isSubmitting} type="submit" value="Sign up"/>
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
        registerRequest: (username, email, password, setSubmitting, setErrors, goToLoginPage) => {
            dispatch(registerRequest(username, email, password, setSubmitting, setErrors, goToLoginPage));
        },
        loginWithGoogleRequest: (idToken) => {
            dispatch(loginWithGoogleRequest(idToken));
        }
    };
}

const ConnectedSignup = connect(mapStateToProps, mapDispatchToProps)(Signup);

export default ConnectedSignup;