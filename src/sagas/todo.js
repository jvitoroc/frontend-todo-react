import { put, takeEvery, call, select, takeLatest } from 'redux-saga/effects';
import {CREATE_TODO, UPDATE_TODO, DELETE_SELECTED_TODOS, DELETE_TODO, FETCH_TODOS, RECEIVE_TODOS} from '../actions/todo';
import {showNotificationRequest} from '../actions/notification';
import {handleFetchRequest, tryHandleVerificationError} from './common';

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

        handleFetchRequest(fetch(parentTodoId ? `http://localhost:8000/todo/${parentTodoId}` : 'http://localhost:8000/todo/', init), resolve, reject);
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

        handleFetchRequest(fetch(`http://localhost:8000/todo/${todoId}`, init), resolve, reject);
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

        handleFetchRequest(fetch(`http://localhost:8000/todo/${todoId}`, init), resolve, reject);
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

        handleFetchRequest(fetch('http://localhost:8000/todo/', init), resolve, reject);
    });
}

function fetchTodos(parentTodoId) {
    return new Promise((resolve, reject)=>{
        const init = {
            method: 'GET',
            headers: {'Authorization': 'Bearer ' + localStorage.getItem("token")}
        }
    
        handleFetchRequest(fetch(parentTodoId ? `http://localhost:8000/todo/${parentTodoId}` : 'http://localhost:8000/todo/', init), resolve, reject);
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
        let [json, status, ok] = [...yield call(createTodo, parentTodoId, todo)];
        if(!ok) throw json;
        yield invalidate();
    }catch(error){
        let handled = yield tryHandleVerificationError(error);
        if(!handled){
            yield put(showNotificationRequest('An error ocurred while trying to create an todo:', error.message, 'error'));
        }
    }
}

function* updateTodoRequest({todoId, todo}) {
    try{
        let [json, status, ok] = [...yield call(updateTodo, todoId, todo)];
        if(!ok) throw json;
        yield invalidate();
    }catch(error){
        let handled = yield tryHandleVerificationError(error);
        if(!handled){
            yield put(showNotificationRequest('An error ocurred while trying to update an todo:', error.message, 'error'));
        }
    }
}

function* deleteTodoRequest({todoId}) {
    try{
        let [json, status, ok] = [...yield call(deleteTodo, todoId)];
        if(!ok) throw json;
        yield invalidate();
    }catch(error){
        let handled = yield tryHandleVerificationError(error);
        if(!handled){
            yield put(showNotificationRequest('An error ocurred while trying to delete an todo:', error.message, 'error'));
        }
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
        
        let [json, status, ok] = [...yield call(deleteSelectedTodos, ids)];
        if(!ok) throw json;
        yield invalidate();
    }catch(error){
        let handled = yield tryHandleVerificationError(error);
        if(!handled){
            yield put(showNotificationRequest('An error ocurred while trying to delete multiple todos:', error.message, 'error'));
        }
    }
}

function* fetchTodosRequest({parentTodoId}) {
    try{
        let [json, status, ok] = [...yield call(fetchTodos, parentTodoId)];
        if(!ok) throw json;
        yield put({type: RECEIVE_TODOS, ...receiveTodos(parentTodoId, json)});
    }catch(error){
        let handled = yield tryHandleVerificationError(error);
        if(!handled){
            yield put(showNotificationRequest('An error ocurred while trying to fetch some todos:', error.message, 'error'));
        }
    }
}

export default function* todoSaga() {
    yield takeEvery(CREATE_TODO, createTodoRequest);
    yield takeEvery(UPDATE_TODO, updateTodoRequest);
    yield takeEvery(DELETE_TODO, deleteTodoRequest);
    yield takeEvery(DELETE_SELECTED_TODOS, deleteSelectedTodosRequest);
    yield takeLatest(FETCH_TODOS, fetchTodosRequest);
}