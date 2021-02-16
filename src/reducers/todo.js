import {
	SELECT_TODO,
	TOGGLE_EDIT_MODE,
	FETCH_TODOS,
	RECEIVE_TODOS
} from '../actions/todo';

import {
	AUTHENTICATE_SUCCESS
} from '../actions/user';

import {
	LOGOUT
} from '../actions/session';

function todo(state = {
	allowDeletion: false,
	isFetching: false,
	fetched: false,
	parents: [],
	parentTodoDescription: null,
	parentTodoId: undefined,
    data: []
}, action) {
    switch (action.type) {
		case AUTHENTICATE_SUCCESS:
		case LOGOUT:
			return {
				...state,
				allowDeletion: false,
				isFetching: false,
				fetched: false,
				parents: [],
				parentTodoDescription: null,
				parentTodoId: undefined,
				data: []
			}
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
		case FETCH_TODOS:
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
				parents: action.parents,
				parentTodoId: action.parentTodoId,
				grandParentTodoId: action.grandParentTodoId,
				parentTodoDescription: action.parentTodoDescription,
				data: action.todos
			}
		default:
			return state
    }
} 

export default todo