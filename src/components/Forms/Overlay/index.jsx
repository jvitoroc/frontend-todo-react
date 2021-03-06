import React from 'react';
import styles from './style.module.css';
import Overlay from '../../Overlay';
import ReactLoading from 'react-loading';
import {IoMdCheckmark} from 'react-icons/io'

function FormOverlay(props){
    let {children, index, ...otherProps} = {...props};
    
    return (
        <Overlay
            {...otherProps}
            index={index}
            states={
                [
                    ()=><div className={styles.overlay}><ReactLoading type={'spin'} color={'gray'} height={'50px'} width={'50px'}/></div>,
                    ()=><div className={styles.overlay}><IoMdCheckmark color={'gray'} size={50}/></div>
                ]
            }
        >
            {children}
        </Overlay>
    );
}

export default FormOverlay;