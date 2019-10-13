import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { View, ScrollView, Text, TouchableHighlight, Image, TextInput, Alert, ActivityIndicator, LayoutAnimation, NativeModules } from 'react-native'
import * as identityActions from 'actions/identity'
import BackupIdentityView from './BackupIdentityView'

@connect(
  state => ({
    validateMnemonics: state.validateMnemonics
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...identityActions
    }, dispatch)
  })
)

export default class BackupIdentity extends Component {
  onSubmit = (event) => {
    this.props.actions.validateMnemonics.requested()
    event.persist()
  }
  
  render() {
    const { intl, mnemonics, validateMnemonics, backup } = this.props
    const loading = validateMnemonics.loading
    console.log(loading)

    return (
      <BackupIdentityView
        style={{ flex: 1 }}
        loading={loading}
        onSubmit={this.onSubmit}
      />
    )
  }
}
