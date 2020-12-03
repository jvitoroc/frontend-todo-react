import React from 'react';
import {MdError, MdInfo} from 'react-icons/md';
import {TransitionGroup, CSSTransition} from 'react-transition-group';
import classnames from 'classnames';
import {connect} from 'react-redux';
import styles from './style.module.css';

function Notification({caption, body, type}){
    let icon = null;
    let iconProps = {color: 'white', size: 24}

    switch(type){
        case 'error':
            icon = <MdError {...iconProps}/>; 
            break;
        default:
        case 'success':
            icon = <MdInfo {...iconProps}/>
    }

    return (
        <div className={classnames(styles.Notification, styles[type])}>
            <div className={styles['icon-wrapper']}>{icon}</div>
            <div className={styles.message}>
                <div className={styles.caption}>{caption}</div>
                {body ? (<div className={styles.body}>{body}</div>):null}
            </div>
        </div>
    )
}

function NotificationCenter(props){
    let notifications = props.notifications.slice(-2).map((e)=>{
        return (
            <CSSTransition
                    key={e.id}
                    timeout={1000}
                    classNames={"item"}
            >
                <Notification {...e}/>
            </CSSTransition>
        );
    });

    return (
        <div className={styles.NotificationCenter}>
            <TransitionGroup appear>    
                {notifications}
            </TransitionGroup>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {...state.notification};
}

const mapDispatchToProps = dispatch => {
    return {
       
    }
}

NotificationCenter = connect(mapStateToProps, mapDispatchToProps)(NotificationCenter);

export { Notification, NotificationCenter };