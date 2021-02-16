import React, { useEffect } from 'react';
import ReactLoading from 'react-loading';
import {Redirect, useLocation} from 'react-router-dom'
import {Route, Switch} from 'react-router-dom';
import {CSSTransition} from 'react-transition-group';
import {connect} from 'react-redux'
import styles from './style.module.css'
import { authenticateRequest, authenticateFailure } from '../../actions/user';
import Topbar from '../Topbar';
import Signup from '../../pages/Signup';
import TodoList from '../../pages/TodoList';
import Verification from '../../pages/Verification';
import Login from '../../pages/Login';
import {NotificationCenter} from '../Notification';

function AppTransition(props){
    return (
        <CSSTransition
            {...props}
            onEnter={()=>{document.body.style.overflow = 'hidden'}}
            onEntered={(isAppearing)=>{if(isAppearing) document.body.style.overflow = 'auto'}}
            onExited={()=>{document.body.style.overflow = 'auto'}}
            classNames="transition"
            timeout={300}
        >
            {props.children}
        </CSSTransition>
    )
}

function LoadingIndicator(){
    return (
        <AppTransition in appear>
            <div className={styles['loading-spinner']}>
                <ReactLoading type={'spin'} color={'gray'} height={'50px'} width={'50px'} />
            </div>
        </AppTransition>
    )
}

function AppRoute(props){
    return (    
        <Route key={props.path} exact path={props.path}>
            {({match})=>(
                <AppTransition
                    appear
                    unmountOnExit
                    in={match != null}
                >
                    <div className={styles.page}>
                        <props.children/>
                    </div>
                </AppTransition>
            )}
        </Route>
    )
}

function ProtectedRoute(props){
    if(props.check && props.check())
        return (
            <AppRoute {...props}>
                {props.children}
            </AppRoute>
        )
    return <Redirect push to={props.redirectTo}/>
}

function App(props){
    let location = useLocation();

    useEffect(()=>{
        let token = localStorage.getItem('token');
        if(token !== null){
            setTimeout(()=>{
                props.authenticateRequest(token);
            }, 200);
        }else{
            props.authenticateFailure();
        }
    }, []);

    if(props.loading){
        return <LoadingIndicator/>
    }

    if(!props.verified && props.authenticated && location.pathname !== '/user/verification'){
        return <Redirect to={'/user/verification'}/>;
    }

    return (
        <div className={styles.App}>
            <NotificationCenter/>
            <Topbar/>
            <div className={styles['pages-wrapper']}>
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
                    <ProtectedRoute
                        path="/user/verification"
                        check={()=>{return props.authenticated && !props.verified}}
                        redirectTo={'/login'}
                        exact
                    >
                        {Verification}
                    </ProtectedRoute>
                    <Redirect to="/todos"/>
                </Switch>
            </div>
        </div>
    );
}

const mapStateToProps = ({user}) => {
    return {currentState: user.currentState, authenticated: user.authenticated, loading: user.loading, verified: user.verified};
}

const mapDispatchToProps = dispatch => {
    return {
        authenticateRequest: (token) => {
            dispatch(authenticateRequest(token));
        },
        authenticateFailure: () => {
            dispatch(authenticateFailure());
        }
    }
}

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);
 
export default ConnectedApp;