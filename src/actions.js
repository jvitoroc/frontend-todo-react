import fetch from 'cross-fetch';

export const ADD_TODO = 'ADD_TODO'
export const RECEIVE_TODO = 'RECEIVE_TODO'
export const DELETE_TODO = 'DELETE_TODO'
export const EDIT_TODO_DESCRIPTION = 'EDIT_TODO_DESCRIPTION'
export const COMPLETE_TODO = 'COMPLETE_TODO'
export const SELECT_TODO = 'SELECT_TODO'
export const TOGGLE_EDIT_MODE = 'TOGGLE_EDIT_MODE'

export const REQUEST_TODOS = 'REQUEST_TODOS'
export const RECEIVE_TODOS = 'RECEIVE_TODOS'
export const RECEIVE_USER = 'RECEIVE_USER'
export const RECEIVE_USER_FAILED = 'RECEIVE_USER_FAILED'
export const LOGOUT_USER = 'LOGOUT_USER'

export const MODIFY_TODO = 'MODIFY_TODO'

export function addTodo() {
	return { type: ADD_TODO }
}

export function receiveTodo(json) {
	return { type: RECEIVE_TODO, todo: Object.assign({editingDescription: false}, json.data) };
}
  
export function selectTodo(todoId) {
	return { type: SELECT_TODO, todoId }
}

export function toggleEditMode(todoId) {
	return { type: TOGGLE_EDIT_MODE, todoId }
}

export function logoutUser() {
	return { type: LOGOUT_USER }
}

export function requestTodos(parentTodoId) {
	return { type: REQUEST_TODOS, parentTodoId }
}

export function receiveUser(data) {
	return {
		type: RECEIVE_USER,
		user: data
	}
}

export function receiveUserFailed() {
	return {
		type: RECEIVE_USER_FAILED
	}
}

export function loginSucessfull(data) {
	return function (dispatch) {
		localStorage.setItem("token", data.token);
		dispatch(receiveUser(data.user));
	}
}

export function logout() {
	return function (dispatch) {
		localStorage.removeItem("token");
		dispatch(logoutUser());
	}
}

export function receiveTodos(parentTodoId, json) {
	let grandParentTodoId, parentTodoDescription;

	console.log(json);

	if(json.data.todo){
		parentTodoDescription = json.data.todo.description;
		if(json.data.parent)
			grandParentTodoId = json.data.parent.todoId;
	}

	return {
		type: RECEIVE_TODOS,
		todos: json.data.children.map((todo) => Object.assign({editingDescription: false}, todo)),
		parentTodoId,
		grandParentTodoId,
		parentTodoDescription
	}
}

export function fetchTodos(parentTodoId) {
	return function (dispatch) {
		if(parentTodoId !== undefined){
			parentTodoId = parseInt(parentTodoId)
		}
		
		dispatch(requestTodos(parentTodoId));

		const init = {
			method: 'GET',
			headers: {'Authorization': 'Bearer ' + localStorage.getItem("token")}
		}

		return fetch(parentTodoId ? `http://localhost:8000/todo/${parentTodoId}` : 'http://localhost:8000/todo/', init)
		.then(
			response => {
				return response.json()
			}
		)
		.then(
			json => {
				dispatch(receiveTodos(parentTodoId, json))
			}
		)
	}
}

export function createTodo(parentTodoId, description) {
	return function (dispatch) {
		dispatch(addTodo(parentTodoId));

		const init = {
			method: 'POST',
			body: JSON.stringify({description}),
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem("token"),
				'Content-Type': 'application/json'
			}
		}

		return fetch(parentTodoId ? `http://localhost:8000/todo/${parentTodoId}` : 'http://localhost:8000/todo/', init)
		.then(
			()=>{dispatch(fetchTodos(parentTodoId))}
		)
	}
}

export function updateTodo(id, todo) {
	return function (dispatch, getState) {
		const init = {
			method: 'PATCH',
			body: JSON.stringify(todo),
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem("token"),
				'Content-Type': 'application/json'
			}
		}

		let parentTodoId = getState().todos.parentTodoId;

		return fetch(`http://localhost:8000/todo/${id}`, init)
		.then(
			()=>{dispatch(fetchTodos(parentTodoId))}
		)
	}
}

export function deleteTodo(id) {
	return function (dispatch, getState) {
		const init = {
			method: 'DELETE',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem("token"),
				'Content-Type': 'application/json'
			}
		}

		let parentTodoId = getState().todos.parentTodoId;

		return fetch(`http://localhost:8000/todo/${id}`, init)
		.then(
			()=>{dispatch(fetchTodos(parentTodoId))}
		)
	}
}

export function deleteSelectedTodos() {
	return function (dispatch, getState) {
		let state = getState();
		let ids = state.todos.data.reduce((acc, todo)=>{
			if(todo.selected)
				return acc.concat([todo.todoId])
			else
				return acc
		}, [])

		const init = {
			method: 'DELETE',
			body: JSON.stringify({ids}),
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem("token"),
				'Content-Type': 'application/json'
			}
		}

		let parentTodoId = state.todos.parentTodoId;

		return fetch('http://localhost:8000/todo/', init)
		.then(
			()=>{dispatch(fetchTodos(parentTodoId))}
		)
	}
}

// export function login(username, password) {
// 	return function (dispatch) {
// 		const init = {
// 			method: 'POST',
// 			body: JSON.stringify({username, password}),
// 			headers: {'Content-Type': 'application/json'}
// 		}

// 		return fetch('http://localhost:8000/user/session', init)
// 		.then(
// 			response => {
// 				return response.json()
// 			}
// 		)
// 		.then(
// 			json => {
// 				dispatch(loginSucessfull(json))
// 			}
// 		)
// 	}
// }