export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const REGISTER_REQUEST = 'REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'REGISTER_FAILURE';

export const LOGOUT = 'LOGOUT';

export const AUTHENTICATE_REQUEST = 'AUTHENTICATE_REQUEST';
export const AUTHENTICATE_SUCCESS = 'AUTHENTICATE_SUCCESS';
export const AUTHENTICATE_FAILURE = 'AUTHENTICATE_FAILURE';

export const CLEAR_STATE = 'CLEAR_STATE';
export const SET_VERIFICATION_STATE = 'SET_VERIFICATION_STATE';

export const VERIFY_REQUEST = 'VERIFY_REQUEST';
export const VERIFY_SUCCESS = 'VERIFY_SUCCESS';
export const VERIFY_FAILURE = 'VERIFY_FAILURE';

export const RESEND_VERIFICATION_CODE_REQUEST = 'RESEND_VERIFICATION_CODE_REQUEST';
export const RESEND_VERIFICATION_CODE_RESPONSE = 'RESEND_VERIFICATION_CODE_RESPONSE';

export function loginRequest(username, password, setSubmitting, setErrors){
	return { type: LOGIN_REQUEST, username, password, setSubmitting, setErrors };
}

export function loginSuccess(){
	return { type: LOGIN_SUCCESS };
}

export function loginFailure(error){
	return { type: LOGIN_FAILURE, error };
}

export function registerRequest(username, email, password, setSubmitting, setErrors, goToLoginPage){
	return { type: REGISTER_REQUEST, username, email, password, setSubmitting, setErrors, goToLoginPage };
}

export function registerSuccess(){
	return { type: REGISTER_SUCCESS };
}

export function registerFailure(error){
	return { type: REGISTER_FAILURE, error };
}

export function logout(){
	return { type: LOGOUT };
}

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

export function resendVerificationCodeRequest(){
	return { type: RESEND_VERIFICATION_CODE_REQUEST };
}

export function resendVerificationCodeResponse(message){
	return { type: RESEND_VERIFICATION_CODE_RESPONSE, message };
}