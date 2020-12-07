import React, {  useEffect } from 'react';
import { connect } from 'react-redux'
import Todo from '../../components/Todo';
import { createTodo, deleteTodo, updateTodo, selectTodo, toggleEditMode, deleteSelectedTodos, fetchTodos } from '../../actions/todo';
import { showNotificationRequest } from '../../actions/notification';
import styles from './style.module.css';
import {MdAdd, MdDelete, MdArrowUpward} from 'react-icons/md'
import {TransitionGroup, CSSTransition} from 'react-transition-group';
import {withRouter} from 'react-router-dom';
import classnames from 'classnames';
import { useState } from 'react';
import { useRef } from 'react';

function TodoList(props){
    const [inputNewTodoActive, setInputNewTodoActive] = useState(false);
    const [inputNewTodoError, setInputNewTodoError] = useState(false);
    const inputNewTodoRef = useRef(null);
    
    useEffect(()=>{
        props.fetchTodos(props.match.params.parentTodoId);
    }, [props.match.params.parentTodoId]);

    useEffect(()=>{
        if(inputNewTodoError)
            props.showNotificationRequest('You must give a description to your todo.', null, 'error');
    }, [inputNewTodoError])

    useEffect(()=>{
        if(inputNewTodoRef){
            if(inputNewTodoActive)
                inputNewTodoRef.current.focus();
            else
                inputNewTodoRef.current.blur();
        }
    }, [inputNewTodoActive]);

    useEffect(()=>{
        document.addEventListener('keyup', onKeyUp);
        return ()=>{document.removeEventListener('keyup', onKeyUp)};
    }, []);

    const showInputNewTodo = () => {
        setInputNewTodoError(false);
        if(!inputNewTodoActive){
            setInputNewTodoActive(true);
        }else{
            createTodo();
        }
    }

    const onKeyUp = (e)=>{
        if(e.code === 'Escape'){
            setInputNewTodoActive(false);
        }else if(e.code === 'Enter'){
            setInputNewTodoActive(true);
        }
    } 

    const onInputNewTodoKeyUp = (e) => {
        if(e.keyCode === 13){
            createTodo();
        }else{
            setInputNewTodoError(false);
        }
    }

    const createTodo = () => {
        let description = inputNewTodoRef.current.value;
        if(description === ""){
            setInputNewTodoError(true);
        }else{
            setInputNewTodoError(false);
            props.createTodo(props.match.params.parentTodoId, description);
            inputNewTodoRef.current.value = "";
        }
    }

    const openTodo = (id) => {
        props.history.push(`/todos/${id}`)
    }

    const goBack = () => {
        if(props.match.params.parentTodoId !== undefined){
            let grandParentTodoId = props.todo.grandParentTodoId;
            props.history.push(`/todos/${grandParentTodoId ? grandParentTodoId:''}`)
        }
    }

    const getWelcomeText = ()=>{
        let hours = (new Date()).getHours();
        if(hours >= 0 && hours <= 11)
            return 'Good morning, here are your todos';
        else if(hours >= 12 && hours <= 17)
            return 'Good afternoon, here are your todos';
        else
            return 'Good evening, here are your todos';
    }
    
    let todos = props.todo.data.map((e) => {
            return (
                <CSSTransition
                    key={e.todoId}
                    timeout={1000}
                    classNames={"item"}
                >
                    <Todo
                        {...e}
                        onOpen={()=>{openTodo(e.todoId)}}
                        onSelect={()=>{props.selectTodo(e.todoId)}}
                        onDelete={()=>{props.deleteTodo(e.todoId)}}
                        onComplete={()=>{props.completeTodo(e.todoId, !e.completed)}}
                        onEditDescription={(description)=>{props.editTodoDescription(e.todoId, description)}}
                        toggleEditMode={()=>{props.toggleEditMode(e.todoId)}}
                    />
                </CSSTransition>
            )
        }
    );

    let deleteButtonClasses = classnames(styles['action-button'], styles['delete-action-button'], !props.todo.allowDeletion ? styles['disabled']:'')
    let goBackClasses = classnames(styles['action-button'], props.match.params.parentTodoId === undefined ? styles['disabled']:'');
    let inputNewTodoClasses = classnames(
        styles['input-new-todo'],
        inputNewTodoActive === true ? styles['active']:'',
        inputNewTodoError === true ? styles['error']:''
    );

    let toBeRendered = null;
    
    if(props.todo.fetched){
        toBeRendered = (
            <TransitionGroup appear>    
                {todos}
            </TransitionGroup>
        );
    }

    let title = props.match.params.parentTodoId ? props.todo.parentTodoDescription:getWelcomeText();

    return (
        <div className={styles.TodoList}>
            <div className={styles['todo-list-title']}>
                <div title={title}>
                    {title}
                </div>
            </div>
            <div className={styles.menu}>
                <div className={styles.actions}>
                    <div onClick={goBack} className={goBackClasses} title={'Go back.'}> 
                        <MdArrowUpward size={24}/>
                    </div> 
                    <div onClick={props.deleteSelectedTodos} className={deleteButtonClasses} title={'Delete selected todos.'}> 
                        <MdDelete size={24}/>
                    </div>
                    <div className={inputNewTodoClasses}>
                        <input ref={inputNewTodoRef} onKeyUp={onInputNewTodoKeyUp} type="text" placeholder="Describe a new todo..."/>
                    </div>
                    <div onClick={showInputNewTodo} className={classnames(styles['action-button'], styles['add-action-button'])} title={'Add todo.'}> 
                        <MdAdd size={24}/>
                    </div>
                </div>
            </div>
            {toBeRendered}
        </div>
    );
}

const mapStateToProps = (state) => {
    return {...state};
}

const mapDispatchToProps = dispatch => {
    return {
        createTodo: (parentTodoId, description) => {
            dispatch(createTodo(parentTodoId, description));
        },
        deleteTodo: todoId => {
            dispatch(deleteTodo(todoId));
        },
        completeTodo: (todoId, completed) => {
            dispatch(updateTodo(todoId, {completed}));
        },
        editTodoDescription: (todoId, description) => {
            dispatch(updateTodo(todoId, {description}));
        },
        selectTodo: todoId => {
            dispatch(selectTodo(todoId))
        },
        toggleEditMode: todoId => {
            dispatch(toggleEditMode(todoId))
        },
        deleteSelectedTodos: () => {
            dispatch(deleteSelectedTodos())
        }, 
        fetchTodos: (parentTodoId) => {
            dispatch(fetchTodos(parentTodoId))
        }, 
        showNotificationRequest: (caption, body, type) => {
            dispatch(showNotificationRequest(caption, body, type))
        }
    }
}

const ConnectedTodoList = connect(mapStateToProps, mapDispatchToProps)(TodoList);
 
export default withRouter(ConnectedTodoList);