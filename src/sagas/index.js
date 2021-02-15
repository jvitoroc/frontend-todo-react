import { all, takeEvery } from 'redux-saga/effects';
import sessionSaga from './session.js';
import userSaga from './user.js';
import todoSaga from './todo.js';
import notificationSaga from './notification.js';

export default function* rootSaga(){
    yield takeEvery('*', console.log);
    yield all([
        sessionSaga(),
        userSaga(),
        todoSaga(),
        notificationSaga()
    ]);
}