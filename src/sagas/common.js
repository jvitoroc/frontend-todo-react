import { put } from "redux-saga/effects";
import { SET_VERIFICATION_STATE } from "../actions/user";

export const API_URL = process.env.REACT_APP_API_URL;

export function* tryHandleVerificationError(error){
    if(error.data && error.data.user && error.data.user.verified === false){
        yield put({type: SET_VERIFICATION_STATE, verified: false, user: error.data.user});
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