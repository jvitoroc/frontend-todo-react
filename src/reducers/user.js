import {
	userActions
} from '../actions'

function user(state = {loading: true, authenticated: false}, action) {
    switch (action.type) {
		case userActions.LOGIN_REQUEST:
			return {
				...state,
				state: 'LOADING',
				authenticated: false
			}
		case userActions.LOGIN_SUCCESS:
			return {
				...state,
				info: action.user,
				state: 'SUCCESS',
				authenticated: true
			}
		case userActions.LOGIN_FAILURE:
			return {
				...state,
				info: action.user,
				loginRequestErrors: action.errors,
				state: 'FAILURE',
				authenticated: false
			}
		case userActions.LOGOUT_SUCCESS:
			return {
				...state,
				loading: false,
				authenticated: false,
				state: null,
				info: {}
			}
		case userActions.AUTHENTICATE_SUCCESS:
			return {
				...state,
				info: action.user,
				loading: false,
				authenticated: true
			}
		case userActions.AUTHENTICATE_FAILURE:
			return {
				...state,
				loading: false,
				authenticated: false
			}
		default:
			return state
    }
}

export default user