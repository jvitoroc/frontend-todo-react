import React, { Component } from 'react';
import classes from './style.module.css';

class Layer extends Component {
    render() {
        let {wrapper, component} = {...this.props};
        let content = null;

        if(wrapper)
            content = wrapper(component === null ? <div/>:component());
        else
            content = component === null ? null:component();

        return (
            <div style={{display: component === null ? 'none':'block'}} className={classes.Layer}>
                {content}
            </div>
        )
    }
}

class Overlay extends Component {
    static defaultProps = {
        className: ''
    }

    render() {
        let {className, index, states, wrapper, ...otherProps} = {...this.props};
        let stateComponent = null;

        if(index >= 0){
            stateComponent = states[index];
        }

        return (
            <div {...otherProps} className={classes.Overlay + ' ' + className}>
                <Layer wrapper={wrapper} component={stateComponent}/>
                {this.props.children}
            </div>
        )
    }
}

export default Overlay;