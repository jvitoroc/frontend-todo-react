import fetch from 'cross-fetch';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const LOGOUT_SUCCESS = 'LOGOUT';

export const AUTHENTICATE_REQUEST = 'AUTHENTICATE_REQUEST';
export const AUTHENTICATE_SUCCESS = 'AUTHENTICATE_SUCCESS';
export const AUTHENTICATE_FAILURE = 'AUTHENTICATE_FAILURE';

export function authenticateFailure(){
	return {type: AUTHENTICATE_FAILURE};
}

export function loginRequest(username, password) {
	return function (dispatch) {
		dispatch({type: LOGIN_REQUEST});

		setTimeout(()=>{
			const init = {
				method: 'POST',
				body: JSON.stringify({username, password}),
				headers: {'Content-Type': 'application/json'}
			}

			return fetch('http://localhost:8000/user/session', init)
			.then(
				response => {
					return Promise.all([response.json(), Promise.resolve(response.ok)]);
				}
			)
			.then(
				response => {
					let [json, ok] = [...response];
					if(ok){
						localStorage.setItem('token', json.data.token);
						dispatch({type: LOGIN_SUCCESS, user: json.data.user});
					}else{
						return Promise.reject(json);
					}
				}
			)
			.catch(
				errors => {
					dispatch({type: LOGIN_FAILURE, errors});
				}
			);
		}, 1000);
	}
}

export function logout() {
	return function (dispatch) {
		localStorage.removeItem("token");
		dispatch({type: LOGOUT_SUCCESS});
	}
}

export function authenticateRequest(token) {
	return function (dispatch) {
		dispatch({type: AUTHENTICATE_REQUEST});
	
		const init = {
			method: 'GET',
			headers: {'Authorization': 'Bearer ' + token}
		};

		return fetch('http://localhost:8000/user/', init)
		.then(
			response => {
				return Promise.all([response.json(), Promise.resolve(response.ok)]);
			}
		)
		.then(
			response => {
				let [json, ok] = [...response];
				if(ok){
					dispatch({type: AUTHENTICATE_SUCCESS, user: json.data});
				}else{
					return Promise.reject(json);
				}
			}
		)
		.catch(
			errors => {
				localStorage.removeItem('token');
				dispatch(authenticateFailure());
			}
		);
	}
}