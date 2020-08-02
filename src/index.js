import React from 'react';
import ReactDOM from 'react-dom';
import Wrapper from './components/Wrapper';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux';
import todoApp from './reducers';

const store = createStore(
	todoApp,
	applyMiddleware(
		thunkMiddleware
	)
);

ReactDOM.render(
	// <React.StrictMode>
		<Provider store={store}>
			<Router>
				<Wrapper/>
			</Router>
		</Provider>
	// </React.StrictMode>,
	,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
