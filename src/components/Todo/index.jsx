import React, { Component } from 'react';
import {IoMdCheckmark} from 'react-icons/io'
import classes from './style.module.css';
import classnames from 'classnames';
import PopupMenu from '../PopupMenu';
import {MdEdit, MdDelete} from 'react-icons/md'

function setEndOfContenteditable(contentEditableElement)
{
    var range,selection;
    if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
    {
        range = document.createRange();//Create a range (a range is a like the selection but invisible)
        range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        selection = window.getSelection();//get the selection object (allows you to change selection)
        selection.removeAllRanges();//remove any selections already made
        selection.addRange(range);//make the range you have just created the visible selection
    }
    else if(document.selection)//IE 8 and lower
    { 
        range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
        range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        range.select();//Select the range (make it the visible selection
    }
}

class Todo extends Component {
    constructor(props){
        super(props);
        this.textRef = React.createRef();
        this.state = {openPopupMenu: false, popupMenuPosX: 0, popupMenuPosY: 0};
    }

    componentDidUpdate = () => {
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

    onEdit = (e) => {
        this.props.toggleEditMode();
    }

    onClick = (e) => {
        if(e.shiftKey)
            this.props.onSelect()
        else
            this.props.onOpen();
    }

    onTextBlur = (e) => {
        this.props.onEditDescription(e.target.textContent);
    }

    onKeyDown = (e) => {
        if(e.keyCode === 13)
            e.target.blur();
    }

    onTextInput = (e) => {
        // e.target.innerHTML = e.target.textContent;
    }

    onContextMenu = (e) => {
        e.preventDefault();
        this.setState({openPopupMenu: true, popupMenuPosX: e.clientX, popupMenuPosY: e.clientY})
        return false;
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
                    <div onClick={this.props.onComplete} className={checkClasses}>{<IoMdCheckmark size={32}/>}</div>
                    <div onClick={this.onClick} onInput={this.onTextInput} onKeyDown={this.onKeyDown} onBlur={this.onTextBlur} className={classes['text']}>
                        <div ref={this.textRef} suppressContentEditableWarning={true} contentEditable={this.props.editingDescription}>
                            {this.props.description}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
 
export default Todo;