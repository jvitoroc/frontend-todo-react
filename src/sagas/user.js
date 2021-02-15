import { put, call, delay, takeLatest } from 'redux-saga/effects';
import {
    AUTHENTICATE_REQUEST, 
    VERIFY_REQUEST,
    SEND_VERIFICATION_CODE_REQUEST,
    sendVerificationCodeResponse,
    verifyFailure,
    authenticateSuccess,
    authenticateFailure,
    verifySuccess
} from '../actions/user';

import { showNotificationRequest } from '../actions/notification';
import { handleFetchRequest, API_URL } from './common';

function authenticateSession(token) {
	return new Promise((resolve, reject)=>{
		const init = {
			method: 'GET',
			headers: {'Authorization': 'Bearer ' + token}
		};

        handleFetchRequest(fetch(`${API_URL}/user`, init), resolve, reject);
    });
}

function verify(verificationCode) {
	return new Promise((resolve, reject)=>{
		const init = {
            method: 'POST',
            body: JSON.stringify({verificationCode}),
			headers: {'Authorization': 'Bearer ' + localStorage.getItem("token")}
		};

        handleFetchRequest(fetch(`${API_URL}/user/verification-request`, init), resolve, reject);
    });
}

function sendVerificationCode() {
	return new Promise((resolve, reject)=>{
		const init = {
            method: 'PUT',
			headers: {'Authorization': 'Bearer ' + localStorage.getItem("token")}
		};

        handleFetchRequest(fetch(`${API_URL}/user/verification-request`, init), resolve, reject);
    });
}

function* onAuthenticate({token}){
    try{
        let [json, status, ok] = [...yield call(authenticateSession, token)];
        if(!ok && status !== 401) throw json;
        localStorage.setItem('token', token);
        yield put(authenticateSuccess(json.data.user, json.data.user.verified, token));
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

function* onSendVerificationCode(){
    try{
        yield delay(250);
        let [json, , ok] = [...yield call(sendVerificationCode)];
        if(!ok) throw json;
        yield put(showNotificationRequest(
            json.message,
            null,
            "success",
            5000
        ));
        yield put(sendVerificationCodeResponse(json.message));
    }catch(error){
        yield put(showNotificationRequest(
            error.message,
            null,
            "error",
            5000
        ));
        yield put(sendVerificationCodeResponse(error.message));
    }
}

export default function* userSaga() {
    yield takeLatest(AUTHENTICATE_REQUEST, onAuthenticate);
    yield takeLatest(VERIFY_REQUEST, onVerify);
    yield takeLatest(SEND_VERIFICATION_CODE_REQUEST, onSendVerificationCode);
}