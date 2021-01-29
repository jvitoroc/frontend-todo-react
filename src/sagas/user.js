import { put, call, delay, takeLatest } from 'redux-saga/effects';
import {
    AUTHENTICATE_REQUEST, 
    LOGIN_REQUEST,
    REGISTER_REQUEST,
    VERIFY_REQUEST,
    RESEND_VERIFICATION_CODE_REQUEST,
    resendVerificationCodeResponse,
    loginSuccess,
    loginFailure,
    registerSuccess,
    registerFailure,
    verifyFailure,
    clearState,
    authenticateSuccess,
    authenticateFailure,
    authenticateRequest,
    verifySuccess
} from '../actions/user';
import { showNotificationRequest } from '../actions/notification';
import { handleFetchRequest, API_URL } from './common';

function createSession(username, password) {
    return new Promise((resolve, reject)=>{
        const init = {
            method: 'POST',
            body: JSON.stringify({username, password}),
            headers: {'Content-Type': 'application/json'}
        }
    
        handleFetchRequest(fetch(`${API_URL}/user/session`, init), resolve, reject);
    });
};

function register(username, email, password) {
    return new Promise((resolve, reject)=>{
        const init = {
            method: 'POST',
            body: JSON.stringify({username, email, password}),
            headers: {'Content-Type': 'application/json'}
        }
    
        handleFetchRequest(fetch(`${API_URL}/user/`, init), resolve, reject);
    });
};

function authenticateSession(token) {
	return new Promise((resolve, reject)=>{
		const init = {
			method: 'GET',
			headers: {'Authorization': 'Bearer ' + token}
		};

        handleFetchRequest(fetch(`${API_URL}/user/`, init), resolve, reject);
    });
}

function verify(verificationCode) {
	return new Promise((resolve, reject)=>{
		const init = {
            method: 'POST',
            body: JSON.stringify({verificationCode}),
			headers: {'Authorization': 'Bearer ' + localStorage.getItem("token")}
		};

        handleFetchRequest(fetch(`${API_URL}/user/verification`, init), resolve, reject);
    });
}

function resendVerificationCode() {
	return new Promise((resolve, reject)=>{
		const init = {
            method: 'POST',
			headers: {'Authorization': 'Bearer ' + localStorage.getItem("token")}
		};

        handleFetchRequest(fetch(`${API_URL}/user/verification/resend`, init), resolve, reject);
    });
}

function* onLogin({username, password, setSubmitting, setErrors}){
    try{
        yield delay(250);
        let [json, status, ok] = [...yield call(createSession, username, password)];
        if(!ok) throw json;
        yield put(loginSuccess());
        yield delay(1000);
        yield put(authenticateRequest(json.data.token));
    }catch(error){
        yield put(loginFailure(error));
        if(setSubmitting) setSubmitting(false);
        if(setErrors) setErrors({'*': error.message, ...error.errors});
    }
}

function* onRegister({username, email, password, setSubmitting, setErrors, goToLoginPage}){
    try{
        yield delay(250);
        let [json, , ok] = [...yield call(register, username, email, password)];
        if(!ok) throw json;
        yield put(registerSuccess());
        yield put(showNotificationRequest(
            json.message,
            json.detail,
            "success",
            10000
        ));
        yield delay(1000);
        yield put(clearState());
        goToLoginPage();
    }catch(error){
        yield put(registerFailure(error));
        setSubmitting(false);
        setErrors({'*': error.message, ...error.errors});
    }
}

function* onAuthenticate({token}){
    try{
        let [json, status, ok] = [...yield call(authenticateSession, token)];
        if(!ok && status === 403 && !json.hasOwnProperty("userVerified")) throw json;
        localStorage.setItem('token', token);
        yield put(authenticateSuccess(json.data, json.userVerified || true, token));
    }catch(error){
        localStorage.removeItem('token');
        yield put(authenticateFailure(error));
    }
}

function* onVerify({verificationCode}){
    try{
        yield delay(250);
        let [json, , ok] = [...yield call(verify, verificationCode)];
        if(!ok) throw json;
        yield put(verifySuccess());
        yield put(showNotificationRequest(
            json.message,
            null,
            "success",
            5000
        ));
    }catch(error){
        yield put(showNotificationRequest(
            error.message,
            null,
            "error",
            5000
        ));
        yield put(verifyFailure(error));
    }
}

function* onResendVerificationCode(){
    try{
        yield delay(250);
        let [json, , ok] = [...yield call(resendVerificationCode)];
        if(!ok) throw json;
        yield put(showNotificationRequest(
            json.message,
            null,
            "success",
            5000
        ));
        yield put(resendVerificationCodeResponse(json.message));
    }catch(error){
        yield put(showNotificationRequest(
            error.message,
            null,
            "error",
            5000
        ));
        yield put(resendVerificationCodeResponse(error.message));
    }
}

export default function* userSaga() {
    yield takeLatest(LOGIN_REQUEST, onLogin);
    yield takeLatest(REGISTER_REQUEST, onRegister);
    yield takeLatest(AUTHENTICATE_REQUEST, onAuthenticate);
    yield takeLatest(VERIFY_REQUEST, onVerify);
    yield takeLatest(RESEND_VERIFICATION_CODE_REQUEST, onResendVerificationCode);
}