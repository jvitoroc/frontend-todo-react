export const SHOW_NOTIFICATION = 'SHOW_NOTIFICATION';
export const SHOW_NOTIFICATION_REQUEST = 'SHOW_NOTIFICATION_REQUEST';
export const DISMISS_NOTIFICATION = 'DISMISS_NOTIFICATION';

export function showNotificationRequest(caption, body, type, duration = 5000){
	return { type: SHOW_NOTIFICATION_REQUEST, caption, body, notifType: type, duration }
}

export function showNotification(id, caption, body, type, duration = 5000){
	return { type: SHOW_NOTIFICATION, id, caption, body, notifType: type, duration }
}

export function dismissNotification(id){
	return { type: DISMISS_NOTIFICATION, id }
}