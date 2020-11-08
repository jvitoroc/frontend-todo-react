import React, { Component } from 'react';
import classes from './style.module.css';
import Overlay from '../../Overlay';
import ReactLoading from 'react-loading';
import {IoMdCheckmark} from 'react-icons/io'

class FormOverlay extends Component {
    render() { 
        let {children, index, ...otherProps} = {...this.props};
        
        return (
            <Overlay
                {...otherProps}
                index={index}
                states={
                    [
                        ()=><div className={classes['overlay']}><ReactLoading type={'spin'} color={'gray'} height={'50px'} width={'50px'}/></div>,
                        ()=><div className={classes['overlay']}><IoMdCheckmark color={'gray'} size={50}/></div>
                    ]
                }
            >
                {children}
            </Overlay>
        );
    }
}

export default FormOverlay;