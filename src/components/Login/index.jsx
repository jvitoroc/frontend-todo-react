import React, { Component } from 'react';
import classes from './style.module.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import {withRouter} from 'react-router-dom';
import classnames from 'classnames';

class Login extends Component {
    state = {  }

    login = (username, password)=>{
		const init = {
			method: 'POST',
			body: JSON.stringify({username, password}),
			headers: {'Content-Type': 'application/json'}
		}

		return fetch('http://localhost:8000/user/session', init);
	}

    handleSubmit = (values, { setSubmitting, setErrors })=>{
        this.login(values.username, values.password)
		.then(
			async response => {
                let json = await response.json();
                if(response.ok === false){
                    console.log(json.message);
                    setErrors({general: json.message});
                    setSubmitting(false);
                }
                else{
                    localStorage.setItem("token", json.token);
                    this.props.history.push("/todos");
                    setSubmitting(false);
                }
			}
        )
    }

    validateForm = (values)=>{
        const errors = {};
        if (!values.username)
            errors.username = 'Username is required.';

        if (!values.password)
            errors.password = 'Password is required.';

        return errors;
    }

    render() { 
        return (
            <div className={classes.Login}>
                <div className={classes["form-wrapper"]}>
                    <Formik
                        initialValues={{ email: '', password: '' }}
                        validate={this.validateForm}
                        onSubmit={this.handleSubmit}
                        >
                        {({ isSubmitting, errors }) => {
                            return (
                                <Form>
                                    {errors.general && <div className={classes["error-message"] + ' ' + classes["general"]}>{errors.general}</div>}
                                    <Field placeholder="Username" className={classes['input']} type="text" name="username"/>
                                    <ErrorMessage name="username" className={classes["error-message"]} component="div"/>
                                    <div></div>
                                    <Field placeholder="Password" className={classes['input']} type="password" name="password"/>
                                    <ErrorMessage name="password" className={classes["error-message"]} component="div"/>
                                    <div></div>
                                    <input disabled={isSubmitting} className={classes["button"]} type="submit" value="Login"/>
                                </Form>
                            )
                        }}
                    </Formik>
                </div>
            </div>
        );
    }
}
 
export default withRouter(Login);