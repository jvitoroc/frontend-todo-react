import {
	SHOW_NOTIFICATION,
	HIDE_NOTIFICATION
} from '../actions/notification';

function notification(state = {notifications: []}, action) {
    switch (action.type) {
		case SHOW_NOTIFICATION:
			return {
				notifications: [...state.notifications, {
					id: action.id,
					caption: action.caption, 
					body: action.body,
					type: action.notifType
				}]
			}
		case HIDE_NOTIFICATION:
			return {
				notifications: state.notifications.filter((e)=>{
					return e.id !== action.id;
				})
			}
		default:
			return state
    }
}

export default notification