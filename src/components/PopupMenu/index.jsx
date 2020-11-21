import React from 'react';
import styles from './style.module.css';

function PopupMenuItem(props){
    const onClick = (e) => {
        e.stopPropagation();
        props.onClick(e);
        props.onClose();
    }
    
    return (
        <div className={styles.PopupMenuItem} onClick={onClick}>
            {/* <div className={classes['icon']}>{props.icon}</div> */}
            <div>{props.label}</div>
        </div>
    );
}

function PopupMenu(props){
    let items = props.items.map((e, i)=>{
        return <PopupMenuItem key={i} icon={e.icon} onClose={props.onClose} onClick={e.onClick} label={e.label}/>
    });
    
    return (
        <div onClick={props.onClose} className={styles['popupmenu-back']} style={{display: props.show ? 'block':'none'}}>
            <div className={styles.PopupMenu} style={{top: props.posY + 'px', left: props.posX + 'px'}}>
                {items}        
            </div>
        </div>
    );
}
 
export default PopupMenu;