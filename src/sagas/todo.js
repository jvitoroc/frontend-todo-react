import { put, takeEvery, call, select, takeLatest } from 'redux-saga/effects';
import {CREATE_TODO, UPDATE_TODO, DELETE_SELECTED_TODOS, DELETE_TODO, FETCH_TODOS, RECEIVE_TODOS} from '../actions/todo';
import {showNotificationRequest} from '../actions/notification';

function createTodo(parentTodoId, todo) {
    return new Promise((resolve, reject)=>{
        const init = {
            method: 'POST',
            body: JSON.stringify(todo),
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token"),
                'Content-Type': 'application/json'
            }
        }

        return fetch(parentTodoId ? `http://localhost:8000/todo/${parentTodoId}` : 'http://localhost:8000/todo/', init)
        .then(
            response => {
                return Promise.all([response.json(), Promise.resolve(response.ok)]);
            }
        )
        .then(
            response => {
                let [json, ok] = [...response];
                if(ok)
                    resolve(json);
            else
                    reject(json);
            }
        )
        .catch(error => { reject(error); });
    });
}

function updateTodo(todoId, todo) {
    return new Promise((resolve, reject)=>{
        const init = {
            method: 'PATCH',
            body: JSON.stringify(todo),
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token"),
                'Content-Type': 'application/json'
            }
        }

        return fetch(`http://localhost:8000/todo/${todoId}`, init)
        .then(
            response => {
                return Promise.all([response.json(), Promise.resolve(response.ok)]);
            }
        )
        .then(
            response => {
                let [json, ok] = [...response];
                if(ok)
                    resolve(json);
            else
                    reject(json);
            }
        )
        .catch(error => { reject(error); });
    });
}

function deleteTodo(todoId) {
    return new Promise((resolve, reject)=>{
        const init = {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token"),
                'Content-Type': 'application/json'
            }
        }

        return fetch(`http://localhost:8000/todo/${todoId}`, init)
        .then(
            response => {
                return Promise.all([response.json(), Promise.resolve(response.ok)]);
            }
        )
        .then(
            response => {
                let [json, ok] = [...response];
                if(ok)
                    resolve(json);
            else
                    reject(json);
            }
        )
        .catch(error => { reject(error); });
    });
}

function deleteSelectedTodos(ids) {
    return new Promise((resolve, reject)=>{
        const init = {
            method: 'DELETE',
            body: JSON.stringify({ids}),
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token"),
                'Content-Type': 'application/json'
            }
        }

        return fetch('http://localhost:8000/todo/', init)
        .then(
            response => {
                return Promise.all([response.json(), Promise.resolve(response.ok)]);
            }
        )
        .then(
            response => {
                let [json, ok] = [...response];
                if(ok)
                    resolve(json);
            else
                    reject(json);
            }
        )
        .catch(error => { reject(error); });
    });
}

function fetchTodos(parentTodoId) {
    return new Promise((resolve, reject)=>{
        const init = {
            method: 'GET',
            headers: {'Authorization': 'Bearer ' + localStorage.getItem("token")}
        }
    
        return fetch(parentTodoId ? `http://localhost:8000/todo/${parentTodoId}` : 'http://localhost:8000/todo/', init)
        .then(
            response => {
                return Promise.all([response.json(), Promise.resolve(response.ok)]);
            }
        )
        .then(
            response => {
                let [json, ok] = [...response];
                if(ok)
                    resolve(json);
               else
                    reject(json);
            }
        )
        .catch(error => { reject(error); });
    });
}

function* invalidate(){
    let state = yield select();
    yield put({type: FETCH_TODOS, parentTodoId: state.todo.parentTodoId});
}

function receiveTodos(parentTodoId, json) {
	let grandParentTodoId, parentTodoDescription;

	if(json.data.todo){
		parentTodoDescription = json.data.todo.description;
		if(json.data.parent)
			grandParentTodoId = json.data.parent.todoId;
	}

	return {
		todos: json.data.children.map((todo) => Object.assign({editingDescription: false}, todo)),
		parentTodoId,
		grandParentTodoId,
		parentTodoDescription
	}
}

function* createTodoRequest({parentTodoId, todo}){
    try{
        yield call(createTodo, parentTodoId, todo);
        yield invalidate();
    }catch(error){
        yield put(showNotificationRequest('An error ocurred while trying to create an todo:', error.message, 'error'));
    }
}

function* updateTodoRequest({todoId, todo}) {
    try{
        yield call(updateTodo, todoId, todo);
        yield invalidate();
        // yield put(showNotificationRequest('Todo successfully updated.', null, 'success'));
    }catch(error){
        yield put(showNotificationRequest('An error ocurred while trying to update an todo:', error.message, 'error'));
    }
}

function* deleteTodoRequest({todoId}) {
    try{
        yield call(deleteTodo, todoId);
        yield invalidate();
    }catch(error){
        yield put(showNotificationRequest('An error ocurred while trying to delete an todo:', error.message, 'error'));
    }
}

function* deleteSelectedTodosRequest() {
    try{
        let state = yield select();
		let ids = state.todo.data.reduce((acc, todo)=>{
			if(todo.selected)
				return acc.concat([todo.todoId])
			else
				return acc
        }, []);
        
        yield call(deleteSelectedTodos, ids);
        yield invalidate();
    }catch(error){
        yield put(showNotificationRequest('An error ocurred while trying to delete multiple todos:', error.message, 'error'));
    }
}

function* fetchTodosRequest({parentTodoId}) {
    try{
        let json = yield call(fetchTodos, parentTodoId);
        yield put({type: RECEIVE_TODOS, ...receiveTodos(parentTodoId, json)});
    }catch(error){
        yield put(showNotificationRequest('An error ocurred while trying to fetch some todos:', error.message, 'error'));
    }
}

export default function* todoSaga() {
    yield takeEvery(CREATE_TODO, createTodoRequest);
    yield takeEvery(UPDATE_TODO, updateTodoRequest);
    yield takeEvery(DELETE_TODO, deleteTodoRequest);
    yield takeEvery(DELETE_SELECTED_TODOS, deleteSelectedTodosRequest);
    yield takeLatest(FETCH_TODOS, fetchTodosRequest);
}