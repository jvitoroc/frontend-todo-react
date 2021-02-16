import {
	AUTHENTICATE_REQUEST,
	AUTHENTICATE_SUCCESS,
	AUTHENTICATE_FAILURE,
	CLEAR_STATE,
	SET_VERIFICATION_STATE,
	VERIFY_SUCCESS,
	VERIFY_REQUEST,
	VERIFY_FAILURE,
	SEND_VERIFICATION_CODE_REQUEST,
	SEND_VERIFICATION_CODE_RESPONSE
} from '../actions/user'

import {
	LOGIN_REQUEST,
	LOGIN_SUCCESS,
	LOGIN_FAILURE,
	LOGIN_WITH_GOOGLE_REQUEST,
	REGISTER_REQUEST,
	REGISTER_SUCCESS,
	REGISTER_FAILURE,
	LOGOUT,
} from '../actions/session'

function user(state = {authenticated: false, verified: true, currentState: null, loading: true}, action) {
    switch (action.type) {
		case SET_VERIFICATION_STATE:
			return {
				...state,
				verified: action.verified,
				user: action.user,
				loading: false,
				currentState: null
			}
		case LOGIN_REQUEST:
			return {
				...state,
				loading: false,
				currentState: LOGIN_REQUEST
			}
		case LOGIN_SUCCESS:
			return {
				...state,
				token: action.token,
				loading: false,
				currentState: LOGIN_SUCCESS
			}
		case LOGIN_FAILURE:
			return {
				...state,
				user: null,
				authenticated: false,
				token: null,
				loading: false,
				currentState: LOGIN_FAILURE
			}
		case LOGIN_WITH_GOOGLE_REQUEST:
			return {
				...state,
				loading: false,
				currentState: LOGIN_WITH_GOOGLE_REQUEST
			}
		case REGISTER_REQUEST:
			return {
				...state,
				loading: false,
				currentState: REGISTER_REQUEST
			}
		case REGISTER_SUCCESS:
			return {
				...state,
				loading: false,
				currentState: REGISTER_SUCCESS
			}
		case REGISTER_FAILURE:
			return {
				...state,
				loading: false,
				currentState: REGISTER_FAILURE
			}
		case LOGOUT:
			localStorage.removeItem('token');
			return {
				...state,
				user: null,
				authenticated: false,
				token: null,
				loading: false,
				currentState: LOGOUT
			}
		case AUTHENTICATE_REQUEST:
			return {
				...state,
				loading: true,
				currentState: AUTHENTICATE_REQUEST
			}
		case AUTHENTICATE_SUCCESS:
			return {
				...state,
				user: action.user,
				authenticated: true,
				verified: action.verified,
				token: action.token,
				loading: false,
				currentState: AUTHENTICATE_SUCCESS
			}
		case AUTHENTICATE_FAILURE:
			return {
				...state,
				user: null,
				authenticated: false,
				token: null,
				loading: false,
				currentState: AUTHENTICATE_FAILURE
			}
		case VERIFY_REQUEST:
			return {
				...state,
				loading: false,
				currentState: VERIFY_REQUEST
			}
		case VERIFY_SUCCESS:
			return {
				...state,
				verified: true,
				loading: false,
				currentState: VERIFY_SUCCESS
			}
		case VERIFY_FAILURE:
			return {
				...state,
				verifyError: action.error,
				loading: false,
				currentState: VERIFY_FAILURE
			}
		case SEND_VERIFICATION_CODE_REQUEST:
			return {
				...state,
				loading: false,
				currentState: SEND_VERIFICATION_CODE_REQUEST
			}
		case SEND_VERIFICATION_CODE_RESPONSE:
			return {
				...state,
				loading: false,
				currentState: SEND_VERIFICATION_CODE_RESPONSE
			}
		case CLEAR_STATE:
			return {
				...state,
				loading: false,
				currentState: null
			}
		default:
			return state
    }
}

export default user