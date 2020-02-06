import React from 'react'

import { Route, Switch, withRouter } from 'react-router-dom'

import Routing from './Routing'

import './App.scss'

class App extends React.Component {
	render() {
		const routes = Routing.map((route, i) => (
			<Route
				path={route.path}
				exact={route.exact}
				render={({ staticContext, ...props }) => <route.component {...props} />}
				key={i}
			/>
		))
		return <Switch>{routes}</Switch>
	}
}

export default withRouter(App)
