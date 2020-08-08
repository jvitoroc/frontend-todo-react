import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import classes from './style.module.css'

class Topbar extends Component {
    render() { 
        return (
            <div className={classes.Topbar}>
                <div>{this.props.user.username}</div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {user: state.user};
}

const mapDispatchToProps = dispatch => {
    return {
        // logout: (todoId, completed) => {
        //     dispatch(updateTodo(todoId, {completed}))
        // }
    }
}

const ConnectedTopbar = connect(mapStateToProps, mapDispatchToProps)(Topbar);
 
export default withRouter(ConnectedTopbar);