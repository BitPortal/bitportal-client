import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { View, Text, ActivityIndicator, Alert } from 'react-native'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { Navigation } from 'react-native-navigation'
import TableView from 'react-native-tableview'
import Modal from 'react-native-modal'
import { eosAccountSelector } from 'selectors/wallet'
import * as walletActions from 'actions/wallet'

const { Section, Item } = TableView

export const errorMessages = (error, messages) => {
  if (!error) { return null }

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    default:
      return '导入失败'
  }
}

@injectIntl

@connect(
  state => ({
    importEOSPrivateKey: state.importEOSPrivateKey,
    eosAccount: eosAccountSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...walletActions
    }, dispatch)
  })
)

export default class SelectEOSAccount extends Component {
  static get options() {
    return {
      topBar: {
        rightButtons: [
          {
            id: 'submit',
            text: '导入',
            fontWeight: '400',
            enabled: false
          }
        ],
        title: {
          text: '选择EOS帐户'
        },
        backButton: {
          title: '返回'
        },
        largeTitle: {
          visible: false
        }
      },
      bottomTabs: {
        visible: false
      }
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.importEOSPrivateKey.loading !== prevState.importEOSPrivateKeyLoading
      || nextProps.importEOSPrivateKey.error !== prevState.importEOSPrivateKeyError
    ) {
      return {
        importEOSPrivateKeyLoading: nextProps.importEOSPrivateKey.loading,
        importEOSPrivateKeyError: nextProps.importEOSPrivateKey.error
      }
    } else {
      return null
    }
  }

  subscription = Navigation.events().bindComponent(this)

  state = {
    selected: [],
    importEOSPrivateKeyLoading: false,
    importEOSPrivateKeyError: null
  }

  selectEOSAccount = (accountName) => {
    if (!!this.props.eosAccount.find((account: string) => account === accountName)) return

    if (this.state.selected.indexOf(accountName) !== -1) {
      this.setState({ selected: this.state.selected.filter(selectedAccountName => selectedAccountName !== accountName)})
    } else {
      this.setState({ selected: [...this.state.selected, accountName]})
    }
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'submit') {
      this.props.actions.importEOSPrivateKey.requested({ selected: this.state.selected, delay: 500, componentId: this.props.componentId })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.selected !== this.state.selected
      || prevState.importEOSPrivateKeyLoading !== this.state.importEOSPrivateKeyLoading
    ) {
      Navigation.mergeOptions(this.props.componentId, {
        topBar: {
          rightButtons: [
            {
              id: 'submit',
              text: '导入',
              fontWeight: '400',
              enabled: this.state.selected.length > 0 && !this.state.importEOSPrivateKeyLoading
            }
          ]
        }
      })
    }
  }

  onModalHide = () => {
    const error = this.state.importEOSPrivateKeyError

    if (error) {
      setTimeout(() => {
        Alert.alert(
          errorMessages(error),
          '',
          [
            { text: '确定', onPress: () => this.clearError() }
          ]
        )
      }, 20)
    }
  }

  clearError = () => {
    this.props.actions.importEOSPrivateKey.clearError()
  }

  render() {
    const { intl, keyAccounts, eosAccount } = this.props

    return (
      <View style={{ flex: 1 }}>
        <TableView
          style={{ flex: 1 }}
          tableViewStyle={TableView.Consts.Style.Grouped}
          reactModuleForCell="SelectEOSAccountTableViewCell"
        >
          <Section />
          <Section>
            {keyAccounts.map(account =>
              <Item
                height={60}
                key={account.accountName}
                onPress={this.selectEOSAccount.bind(this, account.accountName)}
                selectionStyle={TableView.Consts.CellSelectionStyle.None}
                accountName={account.accountName}
                permissions={account.permissions.join(' • ')}
                isSelected={this.state.selected.indexOf(account.accountName) !== -1}
                exist={!!eosAccount.find((accountName) => accountName === account.accountName)}
              />
             )}
          </Section>
        </TableView>
        <Modal
          isVisible={this.state.importEOSPrivateKeyLoading}
          backdropOpacity={0.4}
          useNativeDriver
          animationIn="fadeIn"
          animationInTiming={200}
          backdropTransitionInTiming={200}
          animationOut="fadeOut"
          animationOutTiming={200}
          backdropTransitionOutTiming={200}
          onModalHide={this.onModalHide}
          onModalShow={this.onModalShow}
        >
          {(this.state.importEOSPrivateKeyLoading) && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 14, alignItem: 'center', justifyContent: 'center', flexDirection: 'row' }}>
              <ActivityIndicator size="small" color="#000000" />
              <Text style={{ fontSize: 17, marginLeft: 10, fontWeight: 'bold' }}>{intl.formatMessage({ id: 'identity_loading_hint_importing' })}</Text>
            </View>
          </View>}
        </Modal>
      </View>
    )
  }
}
