export const AUTHENTICATE_REQUEST = 'AUTHENTICATE_REQUEST';
export const AUTHENTICATE_SUCCESS = 'AUTHENTICATE_SUCCESS';
export const AUTHENTICATE_FAILURE = 'AUTHENTICATE_FAILURE';

export const CLEAR_STATE = 'CLEAR_STATE';
export const SET_VERIFICATION_STATE = 'SET_VERIFICATION_STATE';

export const VERIFY_REQUEST = 'VERIFY_REQUEST';
export const VERIFY_SUCCESS = 'VERIFY_SUCCESS';
export const VERIFY_FAILURE = 'VERIFY_FAILURE';

export const SEND_VERIFICATION_CODE_REQUEST = 'SEND_VERIFICATION_CODE_REQUEST';
export const SEND_VERIFICATION_CODE_RESPONSE = 'SEND_VERIFICATION_CODE_RESPONSE';

export function authenticateRequest(token){
	return { type: AUTHENTICATE_REQUEST, token };
}

export function authenticateSuccess(user, verified, token){
	return { type: AUTHENTICATE_SUCCESS, user, verified, token };
}

export function authenticateFailure(){
	return { type: AUTHENTICATE_FAILURE };
}

export function clearState(){
	return { type: CLEAR_STATE };
}

export function verifyRequest(verificationCode){
	return { type: VERIFY_REQUEST, verificationCode };
}

export function verifySuccess(){
	return { type: VERIFY_SUCCESS };
}

export function verifyFailure(error){
	return { type: VERIFY_FAILURE, error };
}

export function sendVerificationCodeRequest(){
	return { type: SEND_VERIFICATION_CODE_REQUEST };
}

export function sendVerificationCodeResponse(message){
	return { type: SEND_VERIFICATION_CODE_RESPONSE, message };
}