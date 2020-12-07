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

export function loginRequest(username, password, setSubmitting, setErrors){
	return { type: LOGIN_REQUEST, username, password, setSubmitting, setErrors };
}

export function registerRequest(username, email, password, setSubmitting, setErrors, goToLoginPage){
	return { type: REGISTER_REQUEST, username, email, password, setSubmitting, setErrors, goToLoginPage };
}

export function logout(){
	return { type: LOGOUT };
}

export function authenticateRequest(token){
	return { type: AUTHENTICATE_REQUEST, token };
}

export function authenticateFailure(){
	return { type: AUTHENTICATE_FAILURE };
}

export function verifyRequest(verificationCode){
	return { type: VERIFY_REQUEST, verificationCode };
}

export function verifySucess(){
	return { type: VERIFY_SUCCESS };
}

export function verifyFailure(error){
	return { type: VERIFY_FAILURE, error };
}