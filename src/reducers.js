import {
    combineReducers
} from 'redux'

import {
    ADD_TODO,
    SELECT_TODO,
	DELETE_TODO,
	DELETE_SELECTED_TODOS,
	EDIT_TODO_DESCRIPTION,
	REQUEST_TODOS,
	RECEIVE_TODOS,
	TOGGLE_EDIT_MODE
} from './actions.js'

function todos(state = {
	allowDeletion: false,
	isFetching: false,
	isCreating: false,
	parentTodoDescription: null,
	parentTodoId: undefined,
    data: []
}, action) {
    switch (action.type) {
		case ADD_TODO:
			return {
				...state,
				isCreating: true,
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
		case REQUEST_TODOS:
			return {
				...state,
				isFetching: true,
				allowDeletion: false
			}
		case RECEIVE_TODOS:
			return {
				...state,
				allowDeletion: false,
				isFetching: false,
				parentTodoId: action.parentTodoId,
				grandParentTodoId: action.grandParentTodoId,
				parentTodoDescription: action.parentTodoDescription,
				data: action.todos
			}
		default:
			return state
    }
} 

const todoApp = combineReducers({
    todos
});

export default todoApp