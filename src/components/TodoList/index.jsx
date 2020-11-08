import React, {  useEffect } from 'react';
import { connect } from 'react-redux'
import Todo from '../Todo';
import { createTodo, selectTodo, deleteSelectedTodos, deleteTodo, fetchTodos, toggleEditMode, updateTodo } from '../../actions';
import classes from './style.module.css';
import {MdAdd, MdDelete, MdArrowUpward} from 'react-icons/md'
import {TransitionGroup, CSSTransition} from 'react-transition-group';
import {withRouter} from 'react-router-dom';
import classnames from 'classnames';
function TodoList(props){

    useEffect(()=>{
        props.fetchTodos(props.match.params.parentTodoId);
    }, [props.match.params.parentTodoId]);


    const createTodo = () => {
        props.createTodo(props.match.params.parentTodoId, '1');
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
    let goBackClasses = classnames(classes['action-button'], props.match.params.parentTodoId === undefined ? classes['disabled']:'')

    return (
        <div className={classes.TodoList}>
            <div className={classes['todo-list-title']}>
                <div>
                    {props.match.params.parentTodoId ? props.todos.parentTodoDescription:getWelcomeText()}
                </div>
            </div>
            <div className={classes['actions']}>
                <div onClick={goBack} className={goBackClasses}> 
                    <MdArrowUpward size={24}/>
                </div>
                <div onClick={createTodo} className={classnames(classes['action-button'], classes['add-action-button'])}> 
                    <MdAdd size={24}/>
                </div>
                <div onClick={props.deleteSelectedTodos} className={deleteButtonClasses}> 
                    <MdDelete size={24}/>
                </div>
            </div>
                {props.todos.fetched ?
                        <TransitionGroup appear>    
                            {todos}
                        </TransitionGroup>
                    :null
                }
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