import React, {useRef} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styles from './style.module.css';
import {verifyRequest} from '../../actions/user';

const CODE_LENGTH = 6;
const CODE_ARRAY = Array.from(Array(CODE_LENGTH));

function Verification({verifyRequest, user}){
    const inputRef = useRef(null);

    function moveCursor(current, offset){
        let i = current + offset;
        i = Math.min(CODE_LENGTH - 1, i);
        i = Math.max(0, i);
        inputRef.current.children[i].focus();
    }

    function onPaste(e){
        let paste = (e.clipboardData || window.clipboardData).getData('text');
        paste = paste.trim();
        if(paste.length === CODE_LENGTH){
            for(let i = 0; i < CODE_LENGTH; i++){
                inputRef.current.children[i].value = paste[i];
            }
            e.preventDefault();
        }
    }

    function onInput(e, i){
        e.target.value = e.target.value.slice(-1);
        moveCursor(i, 1);
        // let code = getVerificationCode();
        // if(code.length === CODE_LENGTH){
        //     verifyRequest(code);
        // }
    }

    function onChange(e){
        let code = getVerificationCode();
        if(code.length === CODE_LENGTH){
            verifyRequest(code);
        }
    }

    function onKeyDown(e, i){
        if(e.key === 'Backspace' || e.key === 'Delete'){
            e.target.value = "";
            moveCursor(i, e.key === 'Backspace' ? -1:1);
            e.preventDefault();
        }
    }

    function getVerificationCode(){
        let code = "";
        for(let i = 0; i < CODE_LENGTH; i++){
            code += inputRef.current.children[i].value;
        }
        return code;
    }

    let inputsToBeRendered = CODE_ARRAY.map((_, i)=>{
        return <input key={i} onChange={onChange} onPaste={onPaste} onInput={(e)=>{onInput(e, i)}} onKeyDown={(e)=>{return onKeyDown(e, i)}}/>;
    });

    return (
        <div className={styles.Verification}>
            <div className={styles['box-wrapper']}>
                <div className={styles.header}>
                    <div className={styles.title}>
                        Hey {user.user.username}, wait a moment.<br/>
                        Your account is not yet verified.
                    </div>
                    <div className={styles.subtitle}>Please, grab the verification code in your mailbox and fill in below with it.</div>
                </div>
                <div className={styles.body}>
                    <div ref={inputRef} className={styles.input}>
                        {inputsToBeRendered}
                    </div>
                    <div className={styles.resend}>Resend verification code</div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = ({user}) => {
    return {user};
}

const mapDispatchToProps = dispatch => {
    return {
        verifyRequest: (verificationCode)=>{
            dispatch(verifyRequest(verificationCode))
        }
    }
}

const ConnectedVerification = connect(mapStateToProps, mapDispatchToProps)(Verification);
 
export default withRouter(ConnectedVerification);
