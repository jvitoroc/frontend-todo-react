import {
    todoActions
} from '../actions'

function todo(state = {
	allowDeletion: false,
	isFetching: false,
	fetched: false,
	parentTodoDescription: null,
	parentTodoId: undefined,
    data: []
}, action) {
    switch (action.type) {
		case todoActions.CREATE_TODO:
		case todoActions.SELECT_TODO:
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
		case todoActions.TOGGLE_EDIT_MODE:
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
		case todoActions.FETCH_TODOS:
			return {
				...state,
				isFetching: true,
				allowDeletion: false,
				fetched: action.parentTodoId === state.parentTodoId
			}
		case todoActions.RECEIVE_TODOS:
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

export default todo