export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const LOGIN_WITH_GOOGLE_REQUEST = 'LOGIN_WITH_GOOGLE_REQUEST';

export const REGISTER_REQUEST = 'REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'REGISTER_FAILURE';

export const LOGOUT = 'LOGOUT';

export function loginRequest(username, password, setSubmitting, setErrors){
	return { type: LOGIN_REQUEST, username, password, setSubmitting, setErrors };
}

export function loginSuccess(){
	return { type: LOGIN_SUCCESS };
}

export function loginFailure(error){
	return { type: LOGIN_FAILURE, error };
}

export function loginWithGoogleRequest(idToken){
	return { type: LOGIN_WITH_GOOGLE_REQUEST, idToken };
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