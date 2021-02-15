import React from 'react';
import styles from './style.module.css';

function Card(props){
    let {children, showLogo} = {...props};

    showLogo = showLogo === undefined ? true:showLogo;
    
    return (
        <div className={styles.Card}>
            {showLogo ? <div className={styles.logo}/>:null}
            {children}
        </div>
    );
}

export default Card;