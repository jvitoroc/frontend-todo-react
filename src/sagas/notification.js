import { put, takeEvery, call, take, delay, race } from 'redux-saga/effects';
import { HIDE_NOTIFICATION, SHOW_NOTIFICATION_REQUEST, showNotification, hideNotification } from '../actions/notification';

let notificationCount = 0;

function* showNotificationRequest(action){
    let id = ++notificationCount;
    yield put(showNotification(id, action.caption, action.body, action.notifType));
    
    const { shouldBeRemoved } = yield race({
        shouldBeRemoved: delay(action.duration || 5000),
        _: take(_action => _action.type === HIDE_NOTIFICATION && _action.id === id)
    })

    if (shouldBeRemoved) {
        yield put(hideNotification(id));
    }
}

export default function* notificationSaga() {
    yield takeEvery(SHOW_NOTIFICATION_REQUEST, showNotificationRequest);
}