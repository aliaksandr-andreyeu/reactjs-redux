import React from 'react'

import { connect } from 'react-redux'

import './index.scss'

import { increment, decrement } from '../../actions'

class Home extends React.Component {
	onIncrement = () => {
		this.props.setIncrement()
	}

	onDecrement = () => {
		this.props.setDecrement()
	}

	render() {
		return (
			<div className="home-page">
				<button
					className="button"
					onClick={() => {
						this.onDecrement()
					}}>
					-
				</button>

				<span className="value">{this.props.value ? this.props.value : 0}</span>

				<button
					className="button"
					onClick={() => {
						this.onIncrement()
					}}>
					+
				</button>
			</div>
		)
	}
}

const mapStateToProps = state => {
	return {
		value: state.value,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		setIncrement: () => dispatch({ type: 'INCREMENT' }),
		setDecrement: () => dispatch({ type: 'DECREMENT' }),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
