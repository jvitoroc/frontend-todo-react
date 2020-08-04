import React, { Component } from 'react';
import TodoList from '../TodoList';
import Login from '../Login';
import './style.css'
import {Route, Switch, withRouter} from 'react-router-dom';
import {TransitionGroup, CSSTransition} from 'react-transition-group';

const routes = [
    { path: '/login', Component: Login },
    { path: '/todos/:parentTodoId?', Component: TodoList }
  ]

class Wrapper extends Component {
    render() { 
        return (
            <TransitionGroup>
                <CSSTransition
                    key={this.props.location.key}
                    classNames="page"
                    timeout={300}
                >
                    <Switch>
                        {routes.map(({ path, Component }) => (
                            <Route key={path} exact path={path}>
                                {() => (
                                    <div className="page">
                                        <Component />
                                    </div>
                                )}
                            </Route>
                        ))}
                    </Switch>
                </CSSTransition>
            </TransitionGroup>
        );
    }
}
 
export default withRouter(Wrapper);