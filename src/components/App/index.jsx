import React, { Component } from 'react';
import './style.css'
import TodoList from '../TodoList';
import Login from '../Login';
import {Route, Switch, Redirect} from 'react-router-dom';
import {TransitionGroup, CSSTransition} from 'react-transition-group';
import Topbar from '../Topbar';
import {authenticateUser} from '../../utils';

const routes = [
    { path: '/login', Component: Login },
    { path: '/todos/:parentTodoId?', Component: TodoList }
]

function AppRoute(props){
    return (    
        <Route exact path={props.path}>
            {() => (
                <div className="page">
                    {props.children()}
                </div>
            )}
        </Route>
    )
}

function ProtectedRoute(props){
    return (
        <AppRoute {...props}>
            {() => props.check() ? <props.children/>:<Redirect to={props.redirectTo}/>}
        </AppRoute>
    )
}

class App extends Component {
    state = {authenticated: false, authenticating: true}

    componentDidMount(){
        authenticateUser()
        .then((authenticated)=>{
            this.setState({authenticated, authenticating: false});
        })
    }

    render() { 
        if(this.state.authenticating){
            return <h1>Loading</h1>
        }

        return (
            <div>
                <Topbar/>
                <TransitionGroup>
                    <CSSTransition
                        classNames="page"
                        timeout={300}
                    >
                        <Switch>
                            <ProtectedRoute
                                path="/login"
                                check={()=>{return !this.state.authenticated}}
                                redirectTo={'/todos'}
                                exact
                            >
                                {Login}
                            </ProtectedRoute>
                            <ProtectedRoute
                                path="/todos/:parentTodoId?"
                                check={()=>{return this.state.authenticated}}
                                redirectTo={'/login'}
                                exact
                            >
                                {TodoList}
                            </ProtectedRoute>
                            <Route>
                                {() => (
                                    <div className="page">
                                        <h1>asdasdasd</h1>
                                    </div>
                                )}
                            </Route>
                        </Switch>
                    </CSSTransition>
                </TransitionGroup>
            </div>
        );
    }
}

export default App;