import { Route, Switch, withRouter } from 'react-router-dom'

import React from 'react'

import Routing from './Routing'

import './App.scss'

class App extends React.Component {
	render() {
		const routes = Routing.map((route, i) => (
			<Route
				path={route.path}
				exact={route.exact}
				render={() => <route.component history={this.props.history} location={this.props.location} />}
				key={i}
			/>
		))

		return (
			<div className="app-box">
				<Switch>{routes}</Switch>
			</div>
		)
	}
}

export default withRouter(App)
