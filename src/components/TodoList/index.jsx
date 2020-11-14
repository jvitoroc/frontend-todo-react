import React, {  useEffect } from 'react';
import { connect } from 'react-redux'
import Todo from '../Todo';
import { createTodo, selectTodo, deleteSelectedTodos, deleteTodo, fetchTodos, toggleEditMode, updateTodo } from '../../actions';
import classes from './style.module.css';
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
            let grandParentTodoId = props.todos.grandParentTodoId;
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

    let todos = props.todos.data.map((e) => {
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

    let deleteButtonClasses = classnames(classes['action-button'], classes['delete-action-button'], !props.todos.allowDeletion ? classes['disabled']:'')
    let goBackClasses = classnames(classes['action-button'], props.match.params.parentTodoId === undefined ? classes['disabled']:'');
    let inputNewTodoClasses = classnames(
        classes['input-new-todo'],
        inputNewTodoActive === true ? classes['active']:'',
        inputNewTodoError === true ? classes['error']:''
    );

    let toBeRendered = null;
    
    if(props.todos.fetched){
        toBeRendered = (
            <TransitionGroup appear>    
                {todos}
            </TransitionGroup>
        );
    }

    let title = props.match.params.parentTodoId ? props.todos.parentTodoDescription:getWelcomeText();

    return (
        <div className={classes.TodoList}>
            <div className={classes['todo-list-title']}>
                <div title={title}>
                    {title}
                </div>
            </div>
            <div className={classes['menu']}>
                <div className={classes['actions']}>
                    <div onClick={goBack} className={goBackClasses} title={'Go back.'}> 
                        <MdArrowUpward size={24}/>
                    </div> 
                    <div onClick={props.deleteSelectedTodos} className={deleteButtonClasses} title={'Delete selected todos.'}> 
                        <MdDelete size={24}/>
                    </div>
                    <div className={inputNewTodoClasses}>
                        <input ref={inputNewTodoRef} onKeyUp={onInputNewTodoKeyUp} type="text" placeholder="Name a new todo..."/>
                    </div>
                    <div onClick={showInputNewTodo} className={classnames(classes['action-button'], classes['add-action-button'])} title={'Add todo.'}> 
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
        completeTodo: (todoId, completed) => {
            dispatch(updateTodo(todoId, {completed}))
        },
        selectTodo: todoId => {
            dispatch(selectTodo(todoId))
        },
        toggleEditMode: todoId => {
            dispatch(toggleEditMode(todoId))
        },
        createTodo: (parentTodoId, description) => {
            dispatch(createTodo(parentTodoId, description))
        },
        editTodoDescription: (todoId, description) => {
            dispatch(updateTodo(todoId, {description}))
        },
        deleteSelectedTodos: () => {
            dispatch(deleteSelectedTodos())
        },
        deleteTodo: todoId => {
            dispatch(deleteTodo(todoId))
        },
        fetchTodos: (parentTodoId) => {
            dispatch(fetchTodos(parentTodoId))
        }
    }
}

const ConnectedTodoList = connect(mapStateToProps, mapDispatchToProps)(TodoList);
 
export default withRouter(ConnectedTodoList);