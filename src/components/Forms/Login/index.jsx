import React, { useState } from 'react';
import classes from '../common.module.css';
import BaseForm from '../BaseForm';
import Button from '../Button';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { loginSucessfull } from '../../../actions';
import InputText from '../InputText';

function Login(props){
    const [formState, setFormState] = useState(null);

    const login = (username, password)=>{
		const init = {
			method: 'POST',
			body: JSON.stringify({username, password}),
			headers: {'Content-Type': 'application/json'}
		}

		return fetch('http://localhost:8000/user/session', init);
	}

    const handleSubmit = (values, { setSubmitting, setErrors })=>{
        setFormState('LOADING');
        login(values.username, values.password)
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
                    setTimeout(()=>props.loginSucessfull(json.data), 1000);
                }
            }
        )
    }

    const changeFormState = (name, callback)=>{
        this.setState({formState: name}, ()=>{
            if (callback) callback();
        })
    }

    const validateForm = (values)=>{
        const errors = {};
        if (!values.username)
            errors.username = 'Username is required.';

        if (!values.password)
            errors.password = 'Password is required.';

        return errors;
    }

    return (
        <BaseForm
            initialValues={{ username: '', password: '', repeatPassword: '', '*': ''}}
            validate={validateForm}
            onSubmit={handleSubmit}
            state={formState}
            after={<Link className={classes['link']} to={'/signup'}>Create an account</Link>}
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
        loginSucessfull: (data) => {
            dispatch(loginSucessfull(data))
        }
    }
}

const ConnectedLogin = connect(mapStateToProps, mapDispatchToProps)(Login);

export default withRouter(ConnectedLogin);