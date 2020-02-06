import { createBrowserHistory } from 'history'

import React from 'react'

import { render } from 'react-dom'
import { Router } from 'react-router'
import { Provider } from 'react-redux'
import store from './store'

import App from './components/App'

const history = createBrowserHistory()

const app = document.getElementById('app')

render(
	<Provider store={store}>
		<Router history={history}>
			<App />
		</Router>
	</Provider>,
	app
)
