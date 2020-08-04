import React, { Component } from 'react';
import TodoList from '../TodoList';
import Login from '../Login';
import './style.css'
import {Route, Switch, withRouter} from 'react-router-dom';
import {CSSTransition} from 'react-transition-group';

const routes = [
    { path: '/login', name: 'Login', Component: Login },
    { path: '/todos/:parentTodoId?', name: 'Todos', Component: TodoList }
]
  
class Wrapper extends Component {
    render() { 
        return (
            <>
                {routes.map(({ path, Component }) => (
                    <Route key={path} exact path={path}>
                    {({ match }) => (
                        <CSSTransition
                            in={match != null}
                            timeout={300}
                            classNames="page"
                            // unmountOnExit
                        >
                            <div className="page">
                                <Component />
                            </div>
                        </CSSTransition>
                    )}
                    </Route>
                ))}
            </>
        );
    }
}
 
export default withRouter(Wrapper);