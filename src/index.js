import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas';
import todoApp from './reducers';

const sagaMiddleware = createSagaMiddleware()
const store = createStore(
	todoApp,
	applyMiddleware(
		sagaMiddleware
	)
);
sagaMiddleware.run(rootSaga)

ReactDOM.render(
	// <React.StrictMode>
		<Provider store={store}>
			<Router>
				<App/>
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
