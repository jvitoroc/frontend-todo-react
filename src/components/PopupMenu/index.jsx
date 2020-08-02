import React, { Component } from 'react';
import classes from './style.module.css';

class PopupMenuItem extends Component {
    onClick = (e) => {
        e.stopPropagation();
        this.props.onClick(e);
        this.props.onClose();
    }
    
    render() {
        return (
            <div className={classes.PopupMenuItem} onClick={this.onClick}>
                {/* <div className={classes['icon']}>{this.props.icon}</div> */}
                <div>{this.props.label}</div>
            </div>
        );
    }
}

class PopupMenu extends Component {
    render() {
        let items = this.props.items.map((e, i)=>{
            return <PopupMenuItem key={i} icon={e.icon} onClose={this.props.onClose} onClick={e.onClick} label={e.label}/>
        });
        
        return (
            <div onClick={this.props.onClose} className={classes['popupmenu-back']} style={{display: this.props.show ? 'block':'none'}}>
                <div className={classes.PopupMenu} style={{top: this.props.posY + 'px', left: this.props.posX + 'px'}}>
                    {items}        
                </div>
            </div>
        );
    }
}
 
export default PopupMenu;