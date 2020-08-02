import React, { Component } from 'react';
import classes from './style.module.css';
import classnames from 'classnames';

class Login extends Component {
    state = {  }

    render() { 
        return (
            <div className={classes.Login}>
                <div className={classes["form-wrapper"]}>
                    <form>
                        <div className={classes["input-wrapper"]}>
                            <input id="username" placeholder="" required className={classnames(classes["username-input"], classes["input"])} type="text"/>
                            <label htmlFor="username" className={classes["input-label"]}>Username</label>
                        </div>
                        <div className={classes["input-wrapper"]}>
                            <input id="password" placeholder="" name="password" required className={classnames(classes["password-input"], classes["input"])} type="password"/>
                            <label htmlFor="password" className={classes["input-label"]}>Password</label>
                        </div>
                        <div className={classes["submit-button-wrapper"]}>
                            <input className={classes["submit-button"]} type="button" value="Login"/>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
 
export default Login;