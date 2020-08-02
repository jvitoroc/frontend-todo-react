import React, { Component } from 'react';
import TodoList from '../TodoList';
import Login from '../Login';
import {Route, Switch} from 'react-router-dom';

class Wrapper extends Component {
    state = {  }

    render() { 
        return (
            <Switch>
                <Route path="/login" component={Login}/>
                <Route path="/todos/:parentTodoId?" component={TodoList}/>
            </Switch>
        );
    }
}
 
export default Wrapper;