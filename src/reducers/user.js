import {
	userActions
} from '../actions'

function user(state = {authenticated: false}, action) {
    switch (action.type) {
		case userActions.LOGIN_REQUEST:
			return {
				...state,
				currentState: 'LOGIN_REQUEST'
			}
		case userActions.LOGIN_SUCCESS:
			return {
				...state,
				token: action.token,
				currentState: 'LOGIN_SUCCESS'
			}
		case userActions.LOGIN_FAILURE:
			return {
				...state,
				user: null,
				authenticated: false,
				token: null,
				currentState: 'LOGIN_FAILURE'
			}
		case userActions.REGISTER_REQUEST:
			return {
				...state,
				currentState: 'REGISTER_REQUEST'
			}
		case userActions.REGISTER_SUCCESS:
			return {
				...state,
				currentState: 'REGISTER_SUCCESS'
			}
		case userActions.REGISTER_FAILURE:
			return {
				...state,
				currentState: 'REGISTER_FAILURE'
			}
		case userActions.LOGOUT:
			localStorage.removeItem('token');
			return {
				...state,
				user: null,
				authenticated: false,
				token: null,
				currentState: 'LOGOUT'
			}
		case userActions.AUTHENTICATE_REQUEST:
			return {
				...state,
				currentState: 'AUTHENTICATE_REQUEST'
			}
		case userActions.AUTHENTICATE_SUCCESS:
			return {
				...state,
				user: action.user,
				authenticated: true,
				token: action.token,
				currentState: 'AUTHENTICATE_SUCCESS'
			}
		case userActions.AUTHENTICATE_FAILURE:
			return {
				...state,
				user: null,
				authenticated: false,
				token: null,
				currentState: 'AUTHENTICATE_FAILURE'
			}
		case userActions.CLEAR_STATE:
			return {
				...state,
				currentState: null
			}
		default:
			return state
    }
}

export default user