import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../../actions';
import classes from './style.module.css'

class Topbar extends Component {
    handleLogout = ()=>{
        this.props.logout();
    }

    render() {
        let items = []
        let pathname = this.props.location.pathname;

        if(this.props.authenticated){
            items.push(<div key={1} className={classes['text']}>Logged in as <span className={classes['bold']}>{this.props.info.username}</span></div>);
            items.push(<a key={2} className={classes['link'] + ' ' + classes['text']} onClick={this.handleLogout} href="#">Logout</a>);
        }else if(pathname === '/login'){
            items.push(<Link key={3} className={classes['link'] + ' ' + classes['text']} to='/signup'>Sign up</Link>);
        }else if(pathname === '/signup'){
            items.push(<Link key={4} className={classes['link'] + ' ' + classes['text']} to='/login'>Log in</Link>);
        }
        

        return (
            <div className={classes.Topbar}>
                {items}
            </div>
        );
    }
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
 
export default withRouter(ConnectedTopbar);