import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import * as identityActions from 'actions/identity'
import CreateIdentityView from './CreateIdentityView'

@connect(
  state => ({
    createIdentity: state.createIdentity
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...identityActions
    }, dispatch)
  })
)

export default class CreateIdentity extends Component {
  onSubmit = (event) => {
    const values = event.nativeEvent.values
    this.props.actions.createIdentity.requested(values)
    event.persist()
  }
  
  render() {
    const { createIdentity } = this.props
    const loading = createIdentity.loading

    return (
      <CreateIdentityView
        style={{ flex: 1 }}
        loading={loading}
        onSubmit={this.onSubmit}
      />
    )
  }
}
