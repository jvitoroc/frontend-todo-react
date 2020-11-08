import React, { Component } from 'react';
import {IoMdCheckmark} from 'react-icons/io'
import classes from './style.module.css';
import classnames from 'classnames';
import PopupMenu from '../PopupMenu';
import {MdEdit, MdDelete} from 'react-icons/md'

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

class Todo extends Component {
    constructor(props){
        super(props);
        this.textRef = React.createRef();
        this.state = {openPopupMenu: false, popupMenuPosX: 0, popupMenuPosY: 0};
    }

    componentDidUpdate = () => {
        if(this.props.editingDescription){
            this.textRef.current.focus();
            setEndOfContenteditable(this.textRef.current);
        }
    }

    componentDidMount = () => {
        if(this.props.editingDescription)
            this.textRef.current.focus();
    }

    shouldComponentUpdate(nextProps, nextState){
        if(nextProps.completed !== this.props.completed
            || nextProps.selected !== this.props.selected
            || nextProps.text !== this.props.text
            || nextProps.editingDescription !== this.props.editingDescription
            || nextState.openPopupMenu !== this.state.openPopupMenu) return true;
        
        return false;
    }

    onEdit = () => {
        if(!this.props.new)
            this.props.toggleEditMode();
    }

    onClick = (e) => {
        if(!this.props.new){
            if(e.shiftKey)
                this.props.onSelect()
            else
                this.props.onOpen();
        }
    }
    
    onComplete = ()=>{
        if(!this.props.new)
            this.props.onComplete();
    }

    onTextBlur = (e) => {
        this.props.onEditDescription(e.target.textContent);
    }

    onKeyDown = (e) => {
        if(e.keyCode === 13)
            e.target.blur();
    }

    onContextMenu = (e) => {
        if(!this.props.new){
            e.preventDefault();
            this.setState({openPopupMenu: true, popupMenuPosX: e.clientX, popupMenuPosY: e.clientY})
            return false;
        }
    }

    render() { 
        let checkClasses = classnames(classes['check-icon'], this.props.completed ? classes['checked'] : '');
        let todoClasses = classnames(classes.Todo, this.props.selected ? classes['selected'] : '');

        return (
            <div className={classes["todo-wrapper"]}>
                <div onContextMenu={this.onContextMenu} className={todoClasses}>
                    <PopupMenu
                        show={this.state.openPopupMenu}
                        posX={this.state.popupMenuPosX}
                        posY={this.state.popupMenuPosY}
                        onClose={()=>{this.setState({openPopupMenu: false})}}
                        items={[
                            {icon: <MdEdit/>, label: 'Edit', onClick: this.onEdit},
                            {icon: <MdDelete/>, label: 'Delete', onClick: this.props.onDelete}
                        ]}
                    />
                    <div onClick={this.onComplete} className={checkClasses}>{<IoMdCheckmark size={32}/>}</div>
                    <div onClick={this.onClick} onInput={this.onTextInput} onKeyDown={this.onKeyDown} onBlur={this.onTextBlur} className={classes['text']}>
                        <div ref={this.textRef} suppressContentEditableWarning={true} contentEditable={this.props.editingDescription} tabIndex={this.props.editingDescription ? 0:undefined}>
                            {this.props.description}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
 
export default Todo;