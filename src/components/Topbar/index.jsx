import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { logout } from '../../actions/session';
import styles from './style.module.css'

function Topbar(props){
    const handleLogout = ()=>{
        props.logout();
    }

    let items = []

    if(props.authenticated){
        items.push(<div key={1} className={styles.text}>Logged in as <span className={styles.bold}>{props.user.username}</span></div>);
        items.push(<button key={2} className={classnames(styles.button, styles.text)} onClick={handleLogout} href="#">Logout</button>);
    }

    if(items.length === 0)
        return null;

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
            dispatch(logout())
        }
    }
}

const ConnectedTopbar = connect(mapStateToProps, mapDispatchToProps)(Topbar);
 
export default ConnectedTopbar;