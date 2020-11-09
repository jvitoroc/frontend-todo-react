import {
    combineReducers
} from 'redux'

import {
    ADD_TODO,
    SELECT_TODO,
	REQUEST_TODOS,
	RECEIVE_TODOS,
	TOGGLE_EDIT_MODE,
	RECEIVE_USER,
	RECEIVE_USER_FAILED,
	LOGOUT_USER
} from './actions.js'

function todos(state = {
	allowDeletion: false,
	isFetching: false,
	fetched: false,
	parentTodoDescription: null,
	parentTodoId: undefined,
    data: []
}, action) {
    switch (action.type) {
		case ADD_TODO:
		case SELECT_TODO:
			let newTodos = state.data.map((todo) => {
				if (todo.todoId === action.todoId) {
					return Object.assign({}, todo, {
						selected: !todo.selected
					})
				}
				return todo
			});
			return {
				...state,
				allowDeletion: newTodos.reduce((acc, e)=>{
					return acc || e.selected;
				}, false),
				data: newTodos
			}
		case TOGGLE_EDIT_MODE:
			return {
				...state,
				data: state.data.map((todo) => {
					if (todo.todoId === action.todoId) {
						return Object.assign({}, todo, {
							editingDescription: true
						})
					}
					return todo
				})
			}
		case REQUEST_TODOS:
			return {
				...state,
				isFetching: true,
				allowDeletion: false,
				fetched: action.parentTodoId === state.parentTodoId
			}
		case RECEIVE_TODOS:
			return {
				...state,
				allowDeletion: false,
				isFetching: false,
				fetched: true,
				parentTodoId: action.parentTodoId,
				grandParentTodoId: action.grandParentTodoId,
				parentTodoDescription: action.parentTodoDescription,
				data: action.todos
			}
		default:
			return state
    }
} 

function user(state = {loading: true, authenticated: false}, action) {
    switch (action.type) {
		case RECEIVE_USER:
			return {
				...state,
				info: action.user,
				loading: false,
				authenticated: true
			}
		case LOGOUT_USER:
		case RECEIVE_USER_FAILED:
			return {
				...state,
				loading: false,
				authenticated: false,
				info: {}
			}
		default:
			return state
    }
} 

const todoApp = combineReducers({
	todos,
	user
});

export default todoApp