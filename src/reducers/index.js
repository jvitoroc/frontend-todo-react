import {combineReducers} from 'redux';
import todo from './todo.js';
import user from './user.js';
import notification from './notification.js';

export default combineReducers({
	todo,
	user,
	notification
});