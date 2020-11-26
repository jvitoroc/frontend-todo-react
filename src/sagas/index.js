import {all} from 'redux-saga/effects';
import userSaga from './user.js';
import todoSaga from './todo.js';

export default function* rootSaga(){
    yield all([
        userSaga(),
        todoSaga()
    ]);
}