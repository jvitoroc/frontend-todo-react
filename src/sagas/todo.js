import { put, takeEvery, call, select, takeLatest } from 'redux-saga/effects';
import {todoActions} from '../actions';

function createTodo(parentTodoId, todo) {
    const init = {
        method: 'POST',
        body: JSON.stringify(todo),
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("token"),
            'Content-Type': 'application/json'
        }
    }

    return fetch(parentTodoId ? `http://localhost:8000/todo/${parentTodoId}` : 'http://localhost:8000/todo/', init);
}

function updateTodo(todoId, todo) {
    const init = {
        method: 'PATCH',
        body: JSON.stringify(todo),
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("token"),
            'Content-Type': 'application/json'
        }
    }

    return fetch(`http://localhost:8000/todo/${todoId}`, init)
}

function deleteTodo(todoId) {
    const init = {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("token"),
            'Content-Type': 'application/json'
        }
    }

    return fetch(`http://localhost:8000/todo/${todoId}`, init);
}

function deleteSelectedTodos(ids) {
    const init = {
        method: 'DELETE',
        body: JSON.stringify({ids}),
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("token"),
            'Content-Type': 'application/json'
        }
    }

    return fetch('http://localhost:8000/todo/', init);
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
    yield put({type: todoActions.FETCH_TODOS, parentTodoId: state.todo.parentTodoId});
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
        // yield put({type: todoActions.CREATE_TODO_FAILURE, error});
    }
}

function* updateTodoRequest({todoId, todo}) {
    try{
        yield call(updateTodo, todoId, todo);
        yield invalidate();
    }catch(error){
        // yield put({type: todoActions.CREATE_TODO_FAILURE, error});
    }
}

function* deleteTodoRequest({todoId}) {
    try{
        yield call(deleteTodo, todoId);
        yield invalidate();
    }catch(error){
        // yield put({type: todoActions.CREATE_TODO_FAILURE, error});
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
        // yield put({type: todoActions.CREATE_TODO_FAILURE, error});
    }
}

function* fetchTodosRequest({parentTodoId}) {
    try{
        let json = yield call(fetchTodos, parentTodoId);
        yield put({type: todoActions.RECEIVE_TODOS, ...receiveTodos(parentTodoId, json)});
    }catch(error){
        // yield put({type: todoActions.CREATE_TODO_FAILURE, error});
    }
}

export default function* todoSaga() {
    yield takeEvery(todoActions.CREATE_TODO, createTodoRequest);
    yield takeEvery(todoActions.UPDATE_TODO, updateTodoRequest);
    yield takeEvery(todoActions.DELETE_TODO, deleteTodoRequest);
    yield takeEvery(todoActions.DELETE_SELECTED_TODOS, deleteSelectedTodosRequest);
    yield takeLatest(todoActions.FETCH_TODOS, fetchTodosRequest);
    yield takeEvery('*', console.log);
}