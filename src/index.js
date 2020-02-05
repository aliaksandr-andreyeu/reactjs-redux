import { createBrowserHistory } from 'history'

import React from 'react'

import { render } from 'react-dom'
import { Router } from 'react-router'

import App from './components/App'

const history = createBrowserHistory()

const app = document.getElementById('app')

render(
	<Router history={history}>
		<App />
	</Router>,
	app
)
