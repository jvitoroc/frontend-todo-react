import React, { Component } from 'react';
import { connect } from 'react-redux'
import Todo from '../Todo';
import { createTodo, selectTodo, deleteSelectedTodos, deleteTodo, fetchTodos, toggleEditMode, updateTodo } from '../../actions';
import classes from './style.module.css';
import {MdAdd, MdDelete, MdArrowUpward} from 'react-icons/md'
import {SwitchTransition, TransitionGroup, CSSTransition} from 'react-transition-group';
import {withRouter} from 'react-router-dom';
import classnames from 'classnames';
import NewTodo from '../NewTodo';

class TodoList extends Component {
    constructor(props){
        super(props);

        this.state = {
            showNewTodoForm: false
        }
    }

    componentDidMount = () => {
        this.props.fetchTodos(this.props.match.params.parentTodoId);
    }

    componentDidUpdate = (prevProps) => {
        if(this.props.match.params.parentTodoId !== prevProps.match.params.parentTodoId)
            this.props.fetchTodos(this.props.match.params.parentTodoId);
    }

    addTodo = () => {
        // this.setState({showNewTodoForm: true});
        this.props.createTodo(this.props.match.params.parentTodoId, 'Describe your new todo');
    }

    openTodo = (id) => {
        this.props.history.push(`/todos/${id}`)
    }

    goBack = () => {
        let grandParentTodoId = this.props.todos.grandParentTodoId;
        this.props.history.push(`/todos/${grandParentTodoId ? grandParentTodoId:''}`)
    }

    render() {
        // if(this.state.showNewTodoForm){
        //     return <NewTodo/>
        // }

        let todos = this.props.todos.data.map((e) => {
                return (
                    <CSSTransition
                        in={true}
                        appear={true}
                        key={e.todoId}
                        timeout={1000}
                        classNames={"item"}
                        >
                        <Todo
                            {...e}
                            onOpen={()=>{this.openTodo(e.todoId)}}
                            onSelect={()=>{this.props.onSelectTodo(e.todoId)}}
                            onDelete={()=>{this.props.deleteTodo(e.todoId)}}
                            onComplete={()=>{this.props.completeTodo(e.todoId, !e.completed)}}
                            onEditDescription={(description)=>{this.props.editTodoDescription(e.todoId, description)}}
                            toggleEditMode={()=>{this.props.toggleEditMode(e.todoId)}}
                        />
                    </CSSTransition>
                )
            }
        );

        let deleteButtonClasses = classnames(classes['action-button'], classes['delete-action-button'], !this.props.todos.allowDeletion ? classes['disabled']:'')
        let goBackClasses = classnames(classes['action-button'], this.props.match.params.parentTodoId === undefined ? classes['disabled']:'')

        let todoTransitionKey = this.props.match.params.parentTodoId == null ? '':this.props.match.params.parentTodoId;

        return (
            <SwitchTransition mode={'out-in'}>
                <CSSTransition
                    key={todoTransitionKey}
                    addEndListener={(node, done) => {
                        node.addEventListener("transitionend", done, false);
                    }}
                    classNames="fade"
                >
                    <div>
                        <div className={classes.TodoList}>
                            <div className={classes['todo-list-title']}>
                                <div>
                                    {this.props.todos.parentTodoDescription}
                                </div>
                            </div>
                            <div className={classes['actions']}>
                                <div onClick={this.goBack} className={goBackClasses}> 
                                    <MdArrowUpward size={24}/>
                                </div>
                                <div onClick={this.addTodo} className={classnames(classes['action-button'], classes['add-action-button'])}> 
                                    <MdAdd size={24}/>
                                </div>
                                <div onClick={this.props.deleteSelectedTodos} className={deleteButtonClasses}> 
                                    <MdDelete size={24}/>
                                </div>
                            </div>
                            {
                                this.props.todos.data.length > 0 ? 
                                    <TransitionGroup 
                                        in={true}
                                        appear={true}
                                    >    
                                        {todos}
                                    </TransitionGroup>
                                :null
                            }
                        </div>
                    </div>
                </CSSTransition>
            </SwitchTransition>
        );
    }
}

const mapStateToProps = (state) => {
    return {...state};
}

const mapDispatchToProps = dispatch => {
    return {
        completeTodo: (todoId, completed) => {
            dispatch(updateTodo(todoId, {completed}))
        },
        onSelectTodo: todoId => {
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