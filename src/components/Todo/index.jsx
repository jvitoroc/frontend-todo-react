import React, {useEffect, useState, useRef} from 'react';
import Icon from '@mdi/react'
import { mdiCheckboxBlankCircleOutline, mdiCheckCircleOutline, mdiCheckCircle } from '@mdi/js'
import styles from './style.module.css';
import classnames from 'classnames';
import PopupMenu from '../PopupMenu';
import {usePrevious, setEndOfContenteditable} from '../../utils.js';
import {MdEdit, MdDelete} from 'react-icons/md'


function CheckIcon({checked, onClick}){
    const [hovered, setHovered] = useState(false);
    const [ignoreHover, setIgnoreHover] = useState(false);
    const prevChecked = usePrevious(checked);
    const prevHovered = usePrevious(hovered);

    useEffect(()=>{
        if(prevChecked !== checked)
            setIgnoreHover(true)
        else if(prevHovered !== hovered)
            setIgnoreHover(false)
    }, [checked, hovered]);

    let icon;

    if(ignoreHover || !hovered)
        icon = checked ? mdiCheckCircle:mdiCheckboxBlankCircleOutline;
    else
        icon = mdiCheckCircleOutline;

    let checkClasses = classnames(styles['check-icon'], checked ? styles['checked'] : '');

    return (
        <div
            onMouseEnter={()=>{setHovered(true)}}
            onMouseLeave={()=>{setHovered(false)}}
            onClick={onClick} 
            className={checkClasses}>
            <Icon
                path={icon}
                size={1.5}
            />
        </div>
    )
}

function Todo(props){
    const contextMenuRef = useRef(null);
    
    const textRef = useRef(null);

    useEffect(()=>{
        if(props.editingDescription){
            textRef.current.focus();
            setEndOfContenteditable(textRef.current);
        }
    }, [props.editingDescription]);

    const onEdit = () => {
        props.toggleEditMode();
    }

    const onClick = (e) => {
        if(!props.new){
            if(e.shiftKey)
                props.onSelect()
            else if(!props.editingDescription)
                props.onOpen();
        }
    }
    
    const onComplete = ()=>{
        props.onComplete();
    }

    const onTextBlur = (e) => {
        props.onEditDescription(e.target.textContent);
    }

    const onKeyDown = (e) => {
        if(e.keyCode === 13)
            e.target.blur();
    }

    let todoClasses = classnames(styles.Todo, props.selected ? styles['selected'] : '');

    return (
        <div className={styles["todo-wrapper"]}>
            <div ref={contextMenuRef} className={todoClasses}>
                <PopupMenu
                    element={contextMenuRef.current}
                    items={[
                        {icon: <MdEdit/>, label: 'Edit', onClick: onEdit},
                        {icon: <MdDelete/>, label: 'Delete', onClick: props.onDelete}
                    ]}
                />
                <CheckIcon onClick={onComplete} checked={props.completed}/>
                <div onClick={onClick} onKeyDown={onKeyDown} onBlur={onTextBlur} className={styles.text}>
                    <div ref={textRef} suppressContentEditableWarning={true} contentEditable={props.editingDescription} tabIndex={props.editingDescription ? 0:undefined}>
                        {props.description}
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default Todo;