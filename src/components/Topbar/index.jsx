import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { Link, useLocation } from 'react-router-dom'
import { logout } from '../../actions/session';
import styles from './style.module.css'

function Topbar(props){
    const location = useLocation();

    const handleLogout = ()=>{
        props.logout();
    }

    const items = []

    items.push(
        <div className={styles.brand}>
            <div className={styles.logo}/>
            <span className={styles.typograph}>TodoApp</span>
        </div>
    );

    const authLinks = {
        '/signup': {to: '/login', label: 'Login'},
        '/login': {to: '/signup', label: 'Sign up'}
    }

    if(props.authenticated){
        items.push(
            <div className={styles.flex}>
                <div className={styles.text}>Logged in as <span className={styles.bold}>{props.user.username}</span></div>
                <button className={classnames(styles.button, styles.text)} onClick={handleLogout}>Logout</button>
            </div>
        );
    }else if(authLinks.hasOwnProperty(location.pathname)){
        items.push(
            <Link to={authLinks[location.pathname].to} className={classnames(styles.button, styles.text)}>{authLinks[location.pathname].label}</Link>
        );
    }

    if(items.length === 0)
        return null;

    return (
        <div className={styles.Topbar}>
            <div className={styles.content}>
                {items}
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {...state.user};
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => {
            dispatch(logout())
        }
    }
}

const ConnectedTopbar = connect(mapStateToProps, mapDispatchToProps)(Topbar);
 
export default ConnectedTopbar;