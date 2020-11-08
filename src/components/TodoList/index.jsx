import React, { Component } from 'react';
import { connect } from 'react-redux'
import Todo from '../Todo';
import { createTodo, selectTodo, deleteSelectedTodos, deleteTodo, fetchTodos, toggleEditMode, updateTodo } from '../../actions';
import classes from './style.module.css';
import {MdAdd, MdDelete, MdArrowUpward} from 'react-icons/md'
import {TransitionGroup, CSSTransition} from 'react-transition-group';
import {withRouter} from 'react-router-dom';
import classnames from 'classnames';

class TodoList extends Component {
    state = {newTodo: false};

    componentDidMount = () => {
        this.props.fetchTodos(this.props.match.params.parentTodoId);
    }

    componentDidUpdate = (prevProps) => {
        if(this.props.match.params.parentTodoId !== prevProps.match.params.parentTodoId)
            this.props.fetchTodos(this.props.match.params.parentTodoId);
    }

    newTodo = () =>{
        // this.setState({newTodo: true});
    //  this.props.createTodo(this.props.match.params.parentTodoId, description);
    }

    createTodo = (description) => {
        this.props.createTodo(this.props.match.params.parentTodoId, '12312');
        // this.setState({newTodo: false});
    }

    openTodo = (id) => {
        this.props.history.push(`/todos/${id}`)
    }

    goBack = () => {
        if(this.props.match.params.parentTodoId !== undefined){
            let grandParentTodoId = this.props.todos.grandParentTodoId;
            this.props.history.push(`/todos/${grandParentTodoId ? grandParentTodoId:''}`)
        }
    }

    getWelcomeText = ()=>{
        let hours = (new Date()).getHours();
        if(hours >= 0 && hours <= 11)
            return 'Good morning, here are your todos';
        else if(hours >= 12 && hours <= 17)
            return 'Good afternoon, here are your todos';
        else
            return 'Good evening, here are your todos';
    }

    render() {
        let todos = this.props.todos.data.map((e) => {
                return (
                    <CSSTransition
                        key={e.todoId}
                        timeout={1000}
                        classNames={"item"}
                    >
                        <Todo
                            {...e}
                            onOpen={()=>{this.openTodo(e.todoId)}}
                            onSelect={()=>{this.props.selectTodo(e.todoId)}}
                            onDelete={()=>{this.props.deleteTodo(e.todoId)}}
                            onComplete={()=>{this.props.completeTodo(e.todoId, !e.completed)}}
                            onEditDescription={(description)=>{this.props.editTodoDescription(e.todoId, description)}}
                            toggleEditMode={()=>{this.props.toggleEditMode(e.todoId)}}
                        />
                    </CSSTransition>
                )
            }
        );

        // if(this.state.newTodo){
        //     todos.unshift(
        //         <CSSTransition
        //             key={'new-todo'}
        //             timeout={1000}
        //             classNames={"item"}
        //         >
        //             <Todo
        //                 new
        //                 editingDescription
        //                 onEditDescription={(description)=>{this.createTodo(description)}}
        //             />
        //         </CSSTransition>
        //     );
        // }

        let deleteButtonClasses = classnames(classes['action-button'], classes['delete-action-button'], !this.props.todos.allowDeletion ? classes['disabled']:'')
        let goBackClasses = classnames(classes['action-button'], this.props.match.params.parentTodoId === undefined ? classes['disabled']:'')

        return (
            <div className={classes.TodoList}>
                <div className={classes['todo-list-title']}>
                    <div>
                        {this.props.match.params.parentTodoId ? this.props.todos.parentTodoDescription:this.getWelcomeText()}
                    </div>
                </div>
                <div className={classes['actions']}>
                    <div onClick={this.goBack} className={goBackClasses}> 
                        <MdArrowUpward size={24}/>
                    </div>
                    <div onClick={this.createTodo} className={classnames(classes['action-button'], classes['add-action-button'])}> 
                        <MdAdd size={24}/>
                    </div>
                    <div onClick={this.props.deleteSelectedTodos} className={deleteButtonClasses}> 
                        <MdDelete size={24}/>
                    </div>
                </div>
                    <TransitionGroup>    
                        {todos}
                    </TransitionGroup>
            </div>
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