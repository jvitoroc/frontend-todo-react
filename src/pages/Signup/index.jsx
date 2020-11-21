import React from 'react';
import styles from '../../components/Forms/common.module.css';
import BaseForm from '../../components/Forms/BaseForm';
import Button from '../../components/Forms/Button';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActions } from '../../actions';
import InputText from '../../components/Forms/InputText';
import { useState } from 'react';

function Signup(props){
    const [formState, setFormState] = useState(null);

    const signUp = (username, password)=>{
		const init = {
			method: 'POST',
			body: JSON.stringify({username, password}),
			headers: {'Content-Type': 'application/json'}
		}

		return fetch('http://localhost:8000/user/', init);
	}

    const handleSubmit = (values, { setSubmitting, setErrors })=>{
        setFormState('LOADING');
        signUp(values.username, values.password)
        .then(
            async response => {
                await new Promise((r)=>setTimeout(r, 250));
                let json = await response.json();
                if(response.ok === false){
                    setErrors({"*": json.errors ? '':json.message, ...json.errors});
                    setSubmitting(false);
                    setFormState(null);
                }
                else{
                    setFormState('SUCCESS');
                    setTimeout(()=>props.history.push('/login'), 1000);
                }
            }
        )
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
            state={formState}
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
        loginSucessfull: (data) => {
            dispatch(userActions.loginSucessfull(data))
        }
    }
}

const ConnectedSignup = connect(mapStateToProps, mapDispatchToProps)(Signup);

export default withRouter(ConnectedSignup);