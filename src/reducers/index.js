import {combineReducers} from 'redux';
import todo from './todo.js';
import user from './user.js';

export default combineReducers({
	todo,
	user
});