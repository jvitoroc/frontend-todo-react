import React from 'react';
import classnames from 'classnames';
import styles from './style.module.css';

function Layer(props){
    let {wrapper, component} = {...props};
    let content = null;

    if(wrapper)
        content = wrapper(component === null ? <div/>:component());
    else
        content = component === null ? null:component();

    return (
        <div style={{display: component === null ? 'none':'block'}} className={styles.Layer}>
            {content}
        </div>
    )
}

function Overlay(props){
    let {className, index, states, wrapper, ...otherProps} = {...props};
    let stateComponent = null;

    if(index >= 0){
        stateComponent = states[index];
    }

    return (
        <div {...otherProps} className={classnames(styles.Overlay, className)}>
            <Layer wrapper={wrapper} component={stateComponent}/>
            {props.children}
        </div>
    )
}

export default Overlay;