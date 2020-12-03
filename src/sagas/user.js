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
    LOGIN_SUCCESS
} from '../actions/user';
import {showNotificationRequest} from '../actions/notification';

function createSession(username, password) {
    return new Promise((resolve, reject)=>{
        const init = {
            method: 'POST',
            body: JSON.stringify({username, password}),
            headers: {'Content-Type': 'application/json'}
        }
    
        fetch('http://localhost:8000/user/session', init)
        .then(
            response => {
                return Promise.all([response.json(), Promise.resolve(response.ok)]);
            }
        )
        .then(
            response => {
                let [json, ok] = [...response];
                if(ok)
                    resolve(json);
               else
                    reject(json);
            }
        )
        .catch(error => { reject(error); });
    });
};

function register(username, password) {
    return new Promise((resolve, reject)=>{
        const init = {
            method: 'POST',
            body: JSON.stringify({username, password}),
            headers: {'Content-Type': 'application/json'}
        }
    
        fetch('http://localhost:8000/user/', init)
        .then(
            response => {
                return Promise.all([response.json(), Promise.resolve(response.ok)]);
            }
        )
        .then(
            response => {
                let [json, ok] = [...response];
                if(ok)
                    resolve(json);
               else
                    reject(json);
            }
        )
        .catch(error => { reject(error); });
    });
};

function authenticateSession(token) {
	return new Promise((resolve, reject)=>{
		const init = {
			method: 'GET',
			headers: {'Authorization': 'Bearer ' + token}
		};

        return fetch('http://localhost:8000/user/', init)
        .then(
            response => {
                return Promise.all([response.json(), Promise.resolve(response.ok)]);
            }
        )
		.then(
			response => {
				let [json, ok] = [...response];
                if(ok)
                    resolve(json);
                else
                    reject(json);
			}
		)
		.catch(error => { reject(error); });
    });
}

function* loginRequest({username, password, setSubmitting, setErrors}){
    try{
        yield delay(250);
        let json = yield call(createSession, username, password);
        yield put({type: LOGIN_SUCCESS});
        yield delay(1000);
        yield put({type: AUTHENTICATE_REQUEST, token: json.data.token});
    }catch(error){
        yield put({type: LOGIN_FAILURE, error});
        setSubmitting(false);
        setErrors({'*': error.message, ...error.errors});
    }
}

function* registerRequest({username, password, setSubmitting, setErrors, goToLoginPage}){
    try{
        yield delay(250);
        yield call(register, username, password);
        yield put({type: REGISTER_SUCCESS});
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
        let json = yield call(authenticateSession, token);
        localStorage.setItem('token', token);
        yield put({type: AUTHENTICATE_SUCCESS, user: json.data, token});
    }catch(error){
        localStorage.removeItem('token');
        yield put({type: AUTHENTICATE_FAILURE, error});
    }
}

export default function* userSaga() {
    yield takeLatest(LOGIN_REQUEST, loginRequest);
    yield takeLatest(REGISTER_REQUEST, registerRequest);
    yield takeLatest(AUTHENTICATE_REQUEST, authenticateRequest);
}