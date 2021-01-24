import {
	LOGIN_REQUEST,
	LOGIN_SUCCESS,
	LOGIN_FAILURE,
	REGISTER_REQUEST,
	REGISTER_SUCCESS,
	REGISTER_FAILURE,
	LOGOUT,
	AUTHENTICATE_REQUEST,
	AUTHENTICATE_SUCCESS,
	AUTHENTICATE_FAILURE,
	CLEAR_STATE,
	SET_VERIFICATION_STATE,
	VERIFY_SUCCESS,
	VERIFY_REQUEST,
	VERIFY_FAILURE,
	RESEND_VERIFICATION_CODE_REQUEST,
	RESEND_VERIFICATION_CODE_RESPONSE
} from '../actions/user'

function user(state = {authenticated: false, verified: true}, action) {
    switch (action.type) {
		case SET_VERIFICATION_STATE:
			return {
				...state,
				verified: action.verified,
				user: action.user,
				currentState: null
			}
		case LOGIN_REQUEST:
			return {
				...state,
				currentState: 'LOGIN_REQUEST'
			}
		case LOGIN_SUCCESS:
			return {
				...state,
				token: action.token,
				currentState: 'LOGIN_SUCCESS'
			}
		case LOGIN_FAILURE:
			return {
				...state,
				user: null,
				authenticated: false,
				token: null,
				currentState: 'LOGIN_FAILURE'
			}
		case REGISTER_REQUEST:
			return {
				...state,
				currentState: 'REGISTER_REQUEST'
			}
		case REGISTER_SUCCESS:
			return {
				...state,
				currentState: 'REGISTER_SUCCESS'
			}
		case REGISTER_FAILURE:
			return {
				...state,
				currentState: 'REGISTER_FAILURE'
			}
		case LOGOUT:
			localStorage.removeItem('token');
			return {
				...state,
				user: null,
				authenticated: false,
				token: null,
				currentState: 'LOGOUT'
			}
		case AUTHENTICATE_REQUEST:
			return {
				...state,
				currentState: 'AUTHENTICATE_REQUEST'
			}
		case AUTHENTICATE_SUCCESS:
			return {
				...state,
				user: action.user,
				authenticated: true,
				verified: action.verified,
				token: action.token,
				currentState: 'AUTHENTICATE_SUCCESS'
			}
		case AUTHENTICATE_FAILURE:
			return {
				...state,
				user: null,
				authenticated: false,
				token: null,
				currentState: 'AUTHENTICATE_FAILURE'
			}
		case VERIFY_REQUEST:
			return {
				...state,
				currentState: 'VERIFY_REQUEST'
			}
		case VERIFY_SUCCESS:
			return {
				...state,
				verified: true,
				currentState: 'VERIFY_SUCCESS'
			}
		case VERIFY_FAILURE:
			return {
				...state,
				verifyError: action.error,
				currentState: 'VERIFY_FAILURE'
			}
		case RESEND_VERIFICATION_CODE_REQUEST:
			return {
				...state,
				currentState: 'RESEND_VERIFICATION_CODE_REQUEST'
			}
		case RESEND_VERIFICATION_CODE_RESPONSE:
			return {
				...state,
				currentState: 'RESEND_VERIFICATION_CODE_RESPONSE'
			}
		case CLEAR_STATE:
			return {
				...state,
				currentState: null
			}
		default:
			return state
    }
}

export default user