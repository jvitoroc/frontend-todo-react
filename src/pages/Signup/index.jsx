import React from 'react';
import styles from '../../components/Forms/common.module.css';
import BaseForm from '../../components/Forms/BaseForm';
import Button from '../../components/Forms/Button';
import { withRouter, Link, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerRequest } from '../../actions/user';
import InputText from '../../components/Forms/InputText';

function Signup(props){
    let history = useHistory();
    const handleSubmit = (values, { setSubmitting, setErrors })=>{
        props.registerRequest(values.username, values.password, setSubmitting, setErrors, ()=>{
            history.push('/login');
        });
    };

    const validateForm = (values)=>{
        const errors = {};
        if (!values.username)
            errors.username = 'Username is required.';

        if (!values.password)
            errors.password = 'Password is required.';

        if (!values.password)
            errors.repeatPassword = 'Confirm your password.';
        else if (values.password !== values.repeatPassword)
            errors.repeatPassword = "Passwords don't match.";

        return errors;
    }

    return (
        <BaseForm
            initialValues={{ username: '', password: '', repeatPassword: '' }}
            validate={validateForm}
            onSubmit={handleSubmit}
            state={props.user.currentState}
            after={<Link className={styles.link} to={'/login'}>Already have an account? Log in</Link>}
        >
            {({ isSubmitting, errors, values })=>{
                return (
                    <>
                        <InputText name={'username'} label={'Username'} value={values.username} error={errors.username}/>
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
        registerRequest: (username, password, setSubmitting, setErrors, goToLoginPage) => {
            dispatch(registerRequest(username, password, setSubmitting, setErrors, goToLoginPage));
        }
    };
}

const ConnectedSignup = connect(mapStateToProps, mapDispatchToProps)(Signup);

export default withRouter(ConnectedSignup);