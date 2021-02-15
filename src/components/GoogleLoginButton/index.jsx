import React from 'react';
import GoogleLogin from 'react-google-login';
import styles from './style.module.css';

function GoogleLoginButton({buttonText, onResponse}){
    return (
        <div className={styles.wrapper}>
            <GoogleLogin
                clientId="1011200848629-n2s30r353k7hvgk9k73bsj20b911omvv.apps.googleusercontent.com"
                buttonText={buttonText}
                onSuccess={onResponse}
                cookiePolicy={'single_host_origin'}
            />
        </div>
    );
}

export default GoogleLoginButton;