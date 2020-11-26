import { put, takeEvery, call, delay, takeLatest } from 'redux-saga/effects';
import {userActions} from '../actions';

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
        yield put({type: userActions.LOGIN_SUCCESS});
        yield delay(1000);
        yield put({type: userActions.AUTHENTICATE_REQUEST, token: json.data.token});
    }catch(error){
        yield put({type: userActions.LOGIN_FAILURE, error});
        setSubmitting(false);
        setErrors({'*': error.message, ...error.errors});
    }
}

function* registerRequest({username, password, setSubmitting, setErrors, goToLoginPage}){
    try{
        yield delay(250);
        yield call(register, username, password);
        yield put({type: userActions.REGISTER_SUCCESS});
        yield delay(1000);
        yield put({type: userActions.CLEAR_STATE});
        goToLoginPage();
    }catch(error){
        yield put({type: userActions.REGISTER_FAILURE, error});
        setSubmitting(false);
        setErrors({'*': error.message, ...error.errors});
    }
}

function* authenticateRequest({token}){
    try{
        let json = yield call(authenticateSession, token);
        localStorage.setItem('token', token);
        yield put({type: userActions.AUTHENTICATE_SUCCESS, user: json.data, token});
    }catch(error){
        localStorage.removeItem('token');
        yield put({type: userActions.AUTHENTICATE_FAILURE, error});
    }
}

export default function* userSaga() {
    yield takeLatest(userActions.LOGIN_REQUEST, loginRequest);
    yield takeLatest(userActions.REGISTER_REQUEST, registerRequest);
    yield takeLatest(userActions.AUTHENTICATE_REQUEST, authenticateRequest);
    yield takeEvery('*', console.log);
}