import React, { useEffect } from 'react';
import ReactLoading from 'react-loading';
import {Redirect, withRouter} from 'react-router-dom'
import {Route, Switch} from 'react-router-dom';
import {TransitionGroup, CSSTransition} from 'react-transition-group';
import {connect} from 'react-redux'
import styles from './style.module.css'
import { userActions } from '../../actions';
import Topbar from '../Topbar';
import Signup from '../../pages/Signup';
import TodoList from '../../pages/TodoList';
import Login from '../../pages/Login';

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
            <div className={styles['loading-spinner']}>
                <ReactLoading type={'spin'} color={'gray'} height={'50px'} width={'50px'} />
            </div>
        </CSSTransition>
    )
}

function AppRoute(props){
    return (    
        <Route exact path={props.path}>
            {() => (
                <div className={styles.page}>
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
        let token = localStorage.getItem('token');
        if(token !== null){
            props.authenticateRequest(token);
        }else{
            props.authenticateFailure();
        }
    }, []);

    if(props.currentState === userActions.AUTHENTICATE_REQUEST){
        return <LoadingIndicator/>
    }

    return (
        <div className={styles.App}>
            <Topbar/>
            <div className={styles['pages-wrapper']}>
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
                            {/* <Redirect to="/404"/> */}
                        </Switch>
                    </CSSTransition>
                </TransitionGroup>
            </div>
        </div>
    );
}

const mapStateToProps = ({user}) => {
    return {currentState: user.currentState, authenticated: user.authenticated};
}

const mapDispatchToProps = dispatch => {
    return {
        authenticateRequest: (token) => {
            dispatch(userActions.authenticateRequest(token));
        },
        authenticateFailure: () => {
            dispatch(userActions.authenticateFailure());
        }
    }
}

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);
 
export default withRouter(ConnectedApp);