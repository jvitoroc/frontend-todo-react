import { put } from "redux-saga/effects";
import { SET_VERIFICATION_STATE } from "../actions/user";

export function* tryHandleVerificationError(error){
    if(error.userVerified === false){
        yield put({type: SET_VERIFICATION_STATE, verified: false, user: error.data});
        return Promise.resolve(true);
    }
    return Promise.resolve(false);
}

export function handleFetchRequest(request, resolve, reject){
    request
    .then(
        response => {
            return Promise.all([response.json(), Promise.resolve(response.status), Promise.resolve(response.ok)]);
        }
    )
    .then(
        response => {
            resolve(response);
        }
    )
    .catch(error => { reject(error); });
}