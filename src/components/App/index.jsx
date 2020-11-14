import React, { Component } from 'react';
import classes from './style.module.css'
import TodoList from '../TodoList';
import Login from '../Forms/Login';
import { receiveUser, receiveUserFailed } from '../../actions';
import {Route, Switch} from 'react-router-dom';
import {TransitionGroup, CSSTransition} from 'react-transition-group';
import {Redirect, withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import Topbar from '../Topbar';
import Signup from '../Forms/Signup';
import {authenticateUser} from '../../utils';
import ReactLoading from 'react-loading';
import { useEffect } from 'react';

function LoadingIndicator(){
    return (
        <CSSTransition
            in={true}
            appear
            onEnter={()=>{document.body.style.overflow = 'hidden'}}
            onExited={()=>{document.body.style.overflow = 'auto'}}
            classNames="transition"
            timeout={300}
        >
            <div className={classes['loading-spinner']}>
                <ReactLoading type={'spin'} color={'gray'} height={'50px'} width={'50px'} />
            </div>
        </CSSTransition>
    )
}

function AppRoute(props){
    return (    
        <Route exact path={props.path}>
            {() => (
                <div className={classes.page}>
                    {<props.children/>}
                </div>
            )}
        </Route>
    )
}

function ProtectedRoute(props){
    if(props.check())
        return (
            <AppRoute {...props}>
                {props.children}
            </AppRoute>
        )
    return <Redirect push to={props.redirectTo}/>
}

function App(props){
    useEffect(()=>{
        authenticateUser()
        .then(({authenticated, user})=>{
            if(authenticated){
                props.receiveUser(user);
            }else{
                localStorage.removeItem("token");
                props.receiveUserFailed();
            }
        })
    }, []);

    if(props.loading){
        return <LoadingIndicator/>
    }

    return (
        <div className={classes.App}>
            <Topbar/>
            <div className={classes['pages-wrapper']}>
                <TransitionGroup>
                    <CSSTransition
                        appear
                        onEnter={()=>{document.body.style.overflow = 'hidden'}}
                        onEntered={(isAppearing)=>{if(isAppearing) document.body.style.overflow = 'auto'}}
                        onExited={()=>{document.body.style.overflow = 'auto'}}
                        key={props.location.key}
                        classNames="transition"
                        timeout={300}
                    >
                        <Switch>
                            <ProtectedRoute
                                path="/login"
                                check={()=>{return !props.authenticated}}
                                redirectTo={'/todos'}
                                exact
                            >
                                {Login}
                            </ProtectedRoute>
                            <ProtectedRoute
                                path="/signup"
                                check={()=>{return !props.authenticated}}
                                redirectTo={'/'}
                                exact
                            >
                                {Signup}
                            </ProtectedRoute>
                            <ProtectedRoute
                                path="/todos/:parentTodoId?"
                                check={()=>{return props.authenticated}}
                                redirectTo={'/login'}
                                exact
                            >
                                {TodoList}
                            </ProtectedRoute>
                            <Redirect to="/404"/>
                        </Switch>
                    </CSSTransition>
                </TransitionGroup>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {loading: state.user.loading, authenticated: state.user.authenticated};
}

const mapDispatchToProps = dispatch => {
    return {
        receiveUser: (data) => {
            dispatch(receiveUser(data))
        },
        receiveUserFailed: (data) => {
            dispatch(receiveUserFailed(data))
        }
    }
}

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);
 
export default withRouter(ConnectedApp);