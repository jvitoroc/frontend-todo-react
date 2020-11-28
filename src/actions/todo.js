export const CREATE_TODO = 'CREATE_TODO'
export const DELETE_TODO = 'DELETE_TODO'
export const UPDATE_TODO = 'UPDATE_TODO'
export const SELECT_TODO = 'SELECT_TODO'
export const DELETE_SELECTED_TODOS = 'DELETE_SELECTED_TODOS'
export const TOGGLE_EDIT_MODE = 'TOGGLE_EDIT_MODE'

export const FETCH_TODOS = 'FETCH_TODOS'
export const RECEIVE_TODOS = 'RECEIVE_TODOS'

export function createTodo(parentTodoId, description){
	return { type: CREATE_TODO, parentTodoId, todo: {description} }
}

export function deleteTodo(todoId){
	return { type: DELETE_TODO, todoId }
}
  
export function updateTodo(todoId, todo){
	return { type: UPDATE_TODO, todoId, todo }
}

export function toggleEditMode(todoId) {
	return { type: TOGGLE_EDIT_MODE, todoId }
}

export function fetchTodos(parentTodoId) {
	return { type: FETCH_TODOS, parentTodoId }
}

export function selectTodo(todoId) {
	return { type: SELECT_TODO, todoId }
}

export function deleteSelectedTodos() {
	return { type: DELETE_SELECTED_TODOS }
}