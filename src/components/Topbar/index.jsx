import React from 'react';
import classnames from 'classnames';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActions } from '../../actions';
import styles from './style.module.css'

function Topbar(props){
    const handleLogout = ()=>{
        props.logout();
    }

    let items = []
    let pathname = props.location.pathname;

    if(props.authenticated){
        items.push(<div key={1} className={styles.text}>Logged in as <span className={styles.bold}>{props.user.username}</span></div>);
        items.push(<button key={2} className={classnames(styles.button, styles.text)} onClick={handleLogout} href="#">Logout</button>);
    }else if(pathname === '/login'){
        items.push(<Link key={3} className={classnames(styles.button, styles.text)} to='/signup'>Sign up</Link>);
    }else if(pathname === '/signup'){
        items.push(<Link key={4} className={classnames(styles.button, styles.text)} to='/login'>Log in</Link>);
    } 

    return (
        <div className={styles.Topbar}>
            {items}
        </div>
    );
}

const mapStateToProps = (state) => {
    return {...state.user};
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => {
            dispatch(userActions.logout())
        }
    }
}

const ConnectedTopbar = connect(mapStateToProps, mapDispatchToProps)(Topbar);
 
export default withRouter(ConnectedTopbar);