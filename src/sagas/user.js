import { put, takeEvery, call, delay, takeLatest } from 'redux-saga/effects';
import {
    REGISTER_SUCCESS, 
    CLEAR_STATE,
    REGISTER_FAILURE, 
    AUTHENTICATE_SUCCESS, 
    AUTHENTICATE_FAILURE, 
    AUTHENTICATE_REQUEST, 
    LOGIN_REQUEST,
    REGISTER_REQUEST,
    LOGIN_FAILURE,
    LOGIN_SUCCESS,
    VERIFY_REQUEST,
    VERIFY_SUCCESS,
    VERIFY_FAILURE,
    RESEND_VERIFICATION_CODE_REQUEST,
    RESEND_VERIFICATION_CODE_RESPONSE,
    resendVerificationCodeResponse
} from '../actions/user';
import { showNotificationRequest, SHOW_NOTIFICATION_REQUEST } from '../actions/notification';
import { handleFetchRequest } from './common';

function createSession(username, password) {
    return new Promise((resolve, reject)=>{
        const init = {
            method: 'POST',
            body: JSON.stringify({username, password}),
            headers: {'Content-Type': 'application/json'}
        }
    
        handleFetchRequest(fetch('http://localhost:8000/user/session', init), resolve, reject);
    });
};

function register(username, email, password) {
    return new Promise((resolve, reject)=>{
        const init = {
            method: 'POST',
            body: JSON.stringify({username, email, password}),
            headers: {'Content-Type': 'application/json'}
        }
    
        handleFetchRequest(fetch('http://localhost:8000/user/', init), resolve, reject);
    });
};

function authenticateSession(token) {
	return new Promise((resolve, reject)=>{
		const init = {
			method: 'GET',
			headers: {'Authorization': 'Bearer ' + token}
		};

        handleFetchRequest(fetch('http://localhost:8000/user/', init), resolve, reject);
    });
}

function verify(verificationCode) {
	return new Promise((resolve, reject)=>{
		const init = {
            method: 'POST',
            body: JSON.stringify({verificationCode}),
			headers: {'Authorization': 'Bearer ' + localStorage.getItem("token")}
		};

        handleFetchRequest(fetch('http://localhost:8000/user/verification', init), resolve, reject);
    });
}

function resendVerificationCode() {
	return new Promise((resolve, reject)=>{
		const init = {
            method: 'POST',
			headers: {'Authorization': 'Bearer ' + localStorage.getItem("token")}
		};

        handleFetchRequest(fetch('http://localhost:8000/user/verification/resend', init), resolve, reject);
    });
}

function* loginRequest({username, password, setSubmitting, setErrors}){
    try{
        yield delay(250);
        let [json, status, ok] = [...yield call(createSession, username, password)];
        if(!ok) throw json;
        yield put({type: LOGIN_SUCCESS});
        yield delay(1000);
        yield put({type: AUTHENTICATE_REQUEST, token: json.data.token});
    }catch(error){
        yield put({type: LOGIN_FAILURE, error});
        if(setSubmitting) setSubmitting(false);
        if(setErrors) setErrors({'*': error.message, ...error.errors});
    }
}

function* registerRequest({username, email, password, setSubmitting, setErrors, goToLoginPage}){
    try{
        yield delay(250);
        let [json, , ok] = [...yield call(register, username, email, password)];
        if(!ok) throw json;
        yield put({type: REGISTER_SUCCESS});
        yield put(showNotificationRequest(
            "User account created successfully:",
            "An email with a verification code was just sent to your email address.",
            "success",
            10000
        ));
        yield delay(1000);
        yield put({type: CLEAR_STATE});
        goToLoginPage();
    }catch(error){
        yield put({type: REGISTER_FAILURE, error});
        setSubmitting(false);
        setErrors({'*': error.message, ...error.errors});
    }
}

function* authenticateRequest({token}){
    try{
        let [json, status, ok] = [...yield call(authenticateSession, token)];
        if(!ok && status === 403 && !json.hasOwnProperty("userVerified")) throw json;
        localStorage.setItem('token', token);
        yield put({type: AUTHENTICATE_SUCCESS, user: json.data, verified: json.userVerified || true, token});
    }catch(error){
        localStorage.removeItem('token');
        yield put({type: AUTHENTICATE_FAILURE, error});
    }
}

function* verifyRequest({verificationCode}){
    try{
        yield delay(250);
        let [json, , ok] = [...yield call(verify, verificationCode)];
        if(!ok) throw json;
        yield put({type: VERIFY_SUCCESS});
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
        yield put({type: VERIFY_FAILURE, error});
    }
}

function* resendVerificationCodeRequest(){
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
    yield takeLatest(LOGIN_REQUEST, loginRequest);
    yield takeLatest(REGISTER_REQUEST, registerRequest);
    yield takeLatest(AUTHENTICATE_REQUEST, authenticateRequest);
    yield takeLatest(VERIFY_REQUEST, verifyRequest);
    yield takeLatest(RESEND_VERIFICATION_CODE_REQUEST, resendVerificationCodeRequest);
}