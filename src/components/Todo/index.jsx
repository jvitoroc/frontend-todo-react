import React from 'react';
import {IoMdCheckmark} from 'react-icons/io'
import styles from './style.module.css';
import classnames from 'classnames';
import PopupMenu from '../PopupMenu';
import {MdEdit, MdDelete} from 'react-icons/md'
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';

function setEndOfContenteditable(contentEditableElement)
{
    var range, selection;
    if(document.createRange)
    {
        range = document.createRange();
        range.selectNodeContents(contentEditableElement);
        range.collapse(false);
        selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }
    else if(document.selection)
    { 
        range = document.body.createTextRange();
        range.moveToElementText(contentEditableElement);
        range.collapse(false);
        range.select();
    }
}

function Todo(props) {
    const [popupMenu, setPopupMenu] = useState({open: false, posX: 0, posY: 0});
    const textRef = useRef(null);

    useEffect(()=>{
        if(props.editingDescription){
            textRef.current.focus();
            setEndOfContenteditable(textRef.current);
        }
    }, [props.editingDescription]);

    // shouldComponentUpdate(nextProps, nextState){
    //     if(nextProps.completed !== this.props.completed
    //         || nextProps.selected !== this.props.selected
    //         || nextProps.text !== this.props.text
    //         || nextProps.editingDescription !== this.props.editingDescription
    //         || nextState.openPopupMenu !== this.state.openPopupMenu) return true;
        
    //     return false;
    // }

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

    const onContextMenu = (e) => {
        e.preventDefault();
        setPopupMenu({open: true, posX: e.clientX, posY: e.clientY})
        return false;
    }

    let checkClasses = classnames(styles['check-icon'], props.completed ? styles['checked'] : '');
    let todoClasses = classnames(styles.Todo, props.selected ? styles['selected'] : '');

    return (
        <div className={styles["todo-wrapper"]}>
            <div onContextMenu={onContextMenu} className={todoClasses}>
                <PopupMenu
                    show={popupMenu.open}
                    posX={popupMenu.posX}
                    posY={popupMenu.posY}
                    onClose={()=>{setPopupMenu({open: false})}}
                    items={[
                        {icon: <MdEdit/>, label: 'Edit', onClick: onEdit},
                        {icon: <MdDelete/>, label: 'Delete', onClick: props.onDelete}
                    ]}
                />
                <div onClick={onComplete} className={checkClasses}>{<IoMdCheckmark size={32}/>}</div>
                <div onClick={onClick} onKeyDown={onKeyDown} onBlur={onTextBlur} className={styles['text']}>
                    <div ref={textRef} suppressContentEditableWarning={true} contentEditable={props.editingDescription} tabIndex={props.editingDescription ? 0:undefined}>
                        {props.description}
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default Todo;