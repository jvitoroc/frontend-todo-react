import React, {useRef} from 'react';
import { connect } from 'react-redux';
import styles from './style.module.css';
import Overlay from '../../components/Forms/Overlay';
import Card from '../../components/Card';
import {verifyRequest, sendVerificationCodeRequest, VERIFY_REQUEST, VERIFY_SUCCESS, SEND_VERIFICATION_CODE_REQUEST} from '../../actions/user';

const CODE_LENGTH = 6;
const CODE_ARRAY = Array.from(Array(CODE_LENGTH));

function Verification({verifyRequest, sendVerificationCodeRequest, user, currentState}){
    const inputRef = useRef(null);

    const moveCursor = (current, offset)=>{
        let i = current + offset;
        i = Math.min(CODE_LENGTH - 1, i);
        i = Math.max(0, i);
        inputRef.current.children[i].focus();
    }

    const onPaste = (e)=>{
        let paste = (e.clipboardData || window.clipboardData).getData('text');
        paste = paste.trim();
        if(paste.length === CODE_LENGTH){
            for(let i = 0; i < CODE_LENGTH; i++){
                inputRef.current.children[i].value = paste[i];
            }
            e.preventDefault();
            tryVerify();
        }
    }

    const onInput = (e, i)=>{
        e.target.value = e.target.value.slice(-1);
        moveCursor(i, 1);
    }

    const onChange = ()=>{
        tryVerify();
    }

    const onKeyDown = (e, i)=>{
        if(e.key === 'Backspace' || e.key === 'Delete'){
            e.target.value = "";
            moveCursor(i, e.key === 'Backspace' ? -1:1);
            e.preventDefault();
        }
    }

    const getVerificationCode = ()=>{
        let code = "";
        for(let i = 0; i < CODE_LENGTH; i++){
            code += inputRef.current.children[i].value;
        }
        return code;
    }

    const tryVerify = ()=>{
        let code = getVerificationCode();
        if(code.length === CODE_LENGTH){
            verifyRequest(code);
        }
    }

    const getInputs = ()=>{
        return CODE_ARRAY.map((_, i)=>{
            return <input key={i} onChange={onChange} onPaste={onPaste} onInput={(e)=>{onInput(e, i)}} onKeyDown={(e)=>{return onKeyDown(e, i)}}/>;
        });
    }

    let index;

    switch(currentState){
        case VERIFY_REQUEST:
        case SEND_VERIFICATION_CODE_REQUEST:
            index = 0;
            break;
        case VERIFY_SUCCESS:
            index = 1;
            break;
        default:
            index = -1;
    }

    return (
        <div className={styles.Verification}>
            <Overlay index={index}>
                <Card>
                    <div className={styles.header}>
                        <div className={styles.title}>
                            Hey {user.username}, wait a moment.<br/>
                            Your account is not yet verified.
                        </div>
                        <div className={styles.subtitle}>Please, grab the verification code in your mailbox and fill in below with it.</div>
                    </div>
                    <div className={styles.body}>
                        <div ref={inputRef} className={styles.input}>
                            {getInputs()}
                        </div>
                        <div className={styles.resend} onClick={sendVerificationCodeRequest}>Send verification code</div>
                    </div>
                </Card>
            </Overlay>
        </div>
    )
}

const mapStateToProps = ({user}) => {
    return {...user};
}

const mapDispatchToProps = dispatch => {
    return {
        verifyRequest: (verificationCode)=>{
            dispatch(verifyRequest(verificationCode))
        },
        sendVerificationCodeRequest: ()=>{
            dispatch(sendVerificationCodeRequest())
        }
    }
}

const ConnectedVerification = connect(mapStateToProps, mapDispatchToProps)(Verification);
 
export default ConnectedVerification;
