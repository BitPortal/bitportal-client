import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import * as identityActions from 'actions/identity'
import RecoverIdentityView from './RecoverIdentityView'

@connect(
  state => ({
    recoverIdentity: state.recoverIdentity
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...identityActions
    }, dispatch)
  })
)

export default class RecoverIdentity extends Component {
  onSubmit = (event) => {
    const values = event.nativeEvent.values
    this.props.actions.recoverIdentity.requested(values)
    event.persist()
  }

  render() {
    const { recoverIdentity } = this.props
    const loading = recoverIdentity.loading

    return (
      <RecoverIdentityView
        style={{ flex: 1 }}
        loading={loading}
        onSubmit={this.onSubmit}
      />
    )
  }
}
