import React from 'react';
import {MdError, MdInfo, MdClose} from 'react-icons/md';
import {TransitionGroup, CSSTransition} from 'react-transition-group';
import { dismissNotification, showNotificationRequest } from '../../actions/notification';
import classnames from 'classnames';
import {connect} from 'react-redux';
import styles from './style.module.css';

function Notification({caption, body, type, onDismiss}){
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
            <div className={classnames(styles['icon-type-wrapper'], styles['icon-wrapper'])}>{icon}</div>
            <div className={styles.message}>
                <div className={styles.caption}>{caption}</div>
                {body ? (<div className={styles.body}>{body}</div>):null}
            </div>
            <div onClick={onDismiss} className={classnames(styles['icon-dismiss-wrapper'], styles['icon-wrapper'])}><MdClose {...iconProps}/></div>
        </div>
    )
}

function NotificationCenter({notifications, dismissNotification}){
    let notificationsToBeRendered = notifications.slice(-2).map((e)=>{
        return (
            <CSSTransition
                    key={e.id}
                    timeout={1000}
                    classNames={"item"}
            >
                <Notification onDismiss={()=>{dismissNotification(e.id)}} {...e}/>
            </CSSTransition>
        );
    });

    return (
        <div className={styles.NotificationCenter}>
            <TransitionGroup appear>    
                {notificationsToBeRendered}
            </TransitionGroup>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {...state.notification};
}

const mapDispatchToProps = dispatch => {
    return {
        dismissNotification: (id)=>{
            dispatch(dismissNotification(id))  
        },
        showNotificationRequest: (caption, body, type, duration)=>{
            dispatch(showNotificationRequest(caption, body, type, duration))  
        }
    }
}

NotificationCenter = connect(mapStateToProps, mapDispatchToProps)(NotificationCenter);

export { Notification, NotificationCenter };