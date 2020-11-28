import React, { useEffect, useState } from 'react';
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

function PopupMenu({element, items}){
    const [settings, setSettings] = useState({show: false, posX: 0, posY: 0});
    
    useEffect(()=>{
        if(element)
            element.addEventListener('contextmenu', onContextMenu);

        return ()=>{
            if(element)
                element.removeEventListener('contextmenu', onContextMenu);
        }
    }, [element]);

    function onContextMenu(e){
        e.preventDefault();
        setSettings({show: true, posX: e.pageX, posY: e.pageY})
        return false;
    }

    function onClose(){
        setSettings({show: false});
    }

    let itemsHTML = items.map((e, i)=>{
        return <PopupMenuItem key={i} icon={e.icon} onClose={onClose} onClick={e.onClick} label={e.label}/>
    });

    let {show, posX, posY} = {...settings};
    let display = {display: show ? 'block':'none'};
    
    return (
        <>
            <div onClick={onClose} onContextMenu={onClose} className={styles['popupmenu-back']} style={display}/>
            <div className={styles.PopupMenu} style={{...display, top: posY + 'px', left: posX + 'px'}}>
                {itemsHTML}        
            </div>
        </>
    );
}
 
export default PopupMenu;