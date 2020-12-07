import { put, takeEvery, take, delay, race } from 'redux-saga/effects';
import { DISMISS_NOTIFICATION, SHOW_NOTIFICATION_REQUEST, dismissNotification, showNotification } from '../actions/notification';

let notificationCount = 0;

function* showNotificationRequest({caption, body, notifType, duration}){
    let id = ++notificationCount;
    yield put(showNotification(id, caption, body, notifType));
    
    const { shouldBeRemoved } = yield race({
        shouldBeRemoved: delay(duration || 5000),
        _: take(_action => _action.type === DISMISS_NOTIFICATION && _action.id === id)
    })

    if (shouldBeRemoved) {
        yield put(dismissNotification(id));
    }
}

export default function* notificationSaga() {
    yield takeEvery(SHOW_NOTIFICATION_REQUEST, showNotificationRequest);
}