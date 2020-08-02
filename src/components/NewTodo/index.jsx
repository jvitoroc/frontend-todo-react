import React, { Component } from 'react';
import classes from './style.module.css';
import {Route, Switch} from 'react-router-dom';

class NewTodo extends Component {
    constructor(props){
        super(props);
        this.textRef = React.createRef();
        this.placeholderRef = React.createRef();
        this.state = {
            description: "",
            focused: false
        }
    }

    componentDidUpdate = ()=>{
        if(this.state.focused)
            this.textRef.current.focus();
    }

    onInput = (e)=>{
        this.setState({description: e.target.textContent})
    }

    onKeyUp = (e)=>{
        if(e.keyCode){

        }
    }

    onBlur = ()=>{
        this.setState({focused: false})
    }

    onPlaceholderClick =()=>{
        this.setState({focused: true});
    }

    render() { 
        let content;

        if(this.state.description === "" && !this.state.focused){
            content = (<div ref={this.placeholderRef} onClick={this.onPlaceholderClick} className={classes["placeholder"]}>Describe your new todo...</div>)
        }else{
            content = (
                <div onInput={this.onInput} onKeyUp={this.onKeyUp} onBlur={this.onBlur} ref={this.textRef} suppressContentEditableWarning={true} contentEditable={true}/>
            )
        }

        return (
            <div className={classes.NewTodo}>
                {content}
            </div>
        );
    }
}
 
export default NewTodo;