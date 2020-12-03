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
	CLEAR_STATE
} from '../actions/user'

function user(state = {authenticated: false}, action) {
    switch (action.type) {
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