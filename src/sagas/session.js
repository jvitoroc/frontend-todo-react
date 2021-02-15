import { put, call, delay, takeLatest } from 'redux-saga/effects';
import {
    LOGIN_REQUEST,
    REGISTER_REQUEST,
    loginSuccess,
    loginFailure,
    registerSuccess,
    registerFailure,
    LOGIN_WITH_GOOGLE_REQUEST
} from '../actions/session';
import {
    authenticateRequest,
    clearState
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

function createGoogleSession(idToken) {
    return new Promise((resolve, reject)=>{
        const init = {
            method: 'POST',
            body: JSON.stringify({idToken}),
            headers: {'Content-Type': 'application/json'}
        }
    
        handleFetchRequest(fetch(`${API_URL}/user/session/google`, init), resolve, reject);
    });
};

function register(username, email, password) {
    return new Promise((resolve, reject)=>{
        const init = {
            method: 'POST',
            body: JSON.stringify({username, email, password}),
            headers: {'Content-Type': 'application/json'}
        }
    
        handleFetchRequest(fetch(`${API_URL}/user`, init), resolve, reject);
    });
};

function* onLogin({username, password, setSubmitting, setErrors}){
    try{
        yield delay(250);
        let [json, , ok] = [...yield call(createSession, username, password)];
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

function* onLoginWithGoogle({idToken}){
    try{
        yield delay(250);
        let [json, , ok] = [...yield call(createGoogleSession, idToken)];
        if(!ok) throw json;
        yield put(loginSuccess());
        yield delay(1000);
        yield put(authenticateRequest(json.data.token));
    }catch(error){
        yield put(loginFailure(error));
        yield put(showNotificationRequest(
            error.message,
            error.detail,
            "error",
            5000
        ));
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
            5000
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

export default function* userSaga() {
    yield takeLatest(LOGIN_REQUEST, onLogin);
    yield takeLatest(LOGIN_WITH_GOOGLE_REQUEST, onLoginWithGoogle);
    yield takeLatest(REGISTER_REQUEST, onRegister);
}