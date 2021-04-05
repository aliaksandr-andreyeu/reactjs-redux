import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { bindActionCreators } from 'redux'

import { increment, decrement } from '../../actions'

import './index.scss'

class Home extends Component {
  render() {
    return (
      <div className="home-page">
        <button
          className="button"
          onClick={() => {
            this.props.decrement()
          }}
        >
          -
        </button>

        <span className="value">{this.props.value ? this.props.value : 0}</span>

        <button
          className="button"
          onClick={() => {
            this.props.increment()
          }}
        >
          +
        </button>
      </div>
    )
  }
}

Home.propTypes = {
  increment: PropTypes.func,
  decrement: PropTypes.func,
  value: PropTypes.number
}

const mapStateToProps = state => {
  return {
    value: state.home.value
  }
}

const mapDispatchToProps = dispatch => {
  return {
    increment: bindActionCreators(increment, dispatch),
    decrement: bindActionCreators(decrement, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
