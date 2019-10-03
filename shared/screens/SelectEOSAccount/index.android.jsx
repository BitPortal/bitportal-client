import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { View, Text, ActivityIndicator, Alert, TouchableNativeFeedback, Dimensions, Image } from 'react-native'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { Navigation } from 'components/Navigation'
import Modal from 'react-native-modal'
import { eosAccountSelector } from 'selectors/wallet'
import * as walletActions from 'actions/wallet'
import IndicatorModal from 'components/Modal/IndicatorModal'
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview'

const dataProvider = new DataProvider((r1, r2) => r1.accountName !== r2.accountName || r1.permissions !== r2.permissions)

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
            icon: require('resources/images/check_android.png'),
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
    const { keyAccounts, eosAccount } = nextProps
    const keyAccountData = keyAccounts.map(account => ({
      key: account.accountName,
      accountName: account.accountName,
      permissions: account.permissions.join(' • '),
      exist: !!eosAccount.find((accountName) => accountName === account.accountName)
    }))

    if (
      nextProps.importEOSPrivateKey.loading !== prevState.importEOSPrivateKeyLoading
      || nextProps.importEOSPrivateKey.error !== prevState.importEOSPrivateKeyError
    ) {
      return {
        importEOSPrivateKeyLoading: nextProps.importEOSPrivateKey.loading,
        importEOSPrivateKeyError: nextProps.importEOSPrivateKey.error,
        dataProvider: dataProvider.cloneWithRows(keyAccountData)
      }
    } else {
      return { dataProvider: dataProvider.cloneWithRows(keyAccountData) }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  state = {
    selected: [],
    importEOSPrivateKeyLoading: false,
    importEOSPrivateKeyError: null,
    dataProvider: dataProvider.cloneWithRows([]),
    extendedState: { selected: [] }
  }

  layoutProvider = new LayoutProvider(
    index => {
      return 0
    },
    (type, dim) => {
      dim.width = Dimensions.get('window').width
      dim.height = 60
    }
  )

  selectEOSAccount = (accountName) => {
    if (!!this.props.eosAccount.find((account: string) => account === accountName)) return

    if (this.state.extendedState.selected.indexOf(accountName) !== -1) {
      this.setState({ extendedState: { selected: this.state.extendedState.selected.filter(selectedAccountName => selectedAccountName !== accountName) } })
    } else {
      this.setState({ extendedState: { selected: [...this.state.extendedState.selected, accountName] } })
    }
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'submit') {
      this.props.actions.importEOSPrivateKey.requested({ selected: this.state.extendedState.selected, delay: 500, componentId: this.props.componentId })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.extendedState.selected !== this.state.extendedState.selected
      || prevState.importEOSPrivateKeyLoading !== this.state.importEOSPrivateKeyLoading
    ) {
      Navigation.mergeOptions(this.props.componentId, {
        topBar: {
          rightButtons: [
            {
              id: 'submit',
              icon: require('resources/images/check_android.png'),
              enabled: this.state.extendedState.selected.length > 0 && !this.state.importEOSPrivateKeyLoading
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

  renderItem = (type, data) => {
    return (
      <TouchableNativeFeedback onPress={this.selectEOSAccount.bind(this, data.accountName)} background={TouchableNativeFeedback.SelectableBackground()} useForeground={true}>
        <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 16 }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            {!(this.state.extendedState.selected.indexOf(data.accountName) !== -1) && !data.exist && <Image source={require('resources/images/radio_unfilled_android.png')} style={{ width: 20, height: 20, marginRight: 10 }} />}
            {(this.state.extendedState.selected.indexOf(data.accountName) !== -1) && !data.exist && <Image source={require('resources/images/circle_check_android.png')} style={{ width: 20, height: 20, marginRight: 10 }} />}
            {!!data.exist && <Image source={require('resources/images/circle_check_grey_android.png')} style={{ width: 20, height: 20, marginRight: 10 }} />}
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 17, color: 'rgba(0,0,0,0.87)' }}>{data.accountName}</Text>
              <Text style={{ fontSize: 15, color: 'rgba(0,0,0,0.54)' }}>{data.permissions}</Text>
            </View>
          </View>
          {data.exist && <View><Text style={{ color: 'rgba(0,0,0,0.6)' }}>已导入</Text></View>}
        </View>
      </TouchableNativeFeedback>
    )
  }

  render() {
    const { intl, keyAccounts, eosAccount } = this.props

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <RecyclerListView
          layoutProvider={this.layoutProvider}
          dataProvider={this.state.dataProvider}
          rowRenderer={this.renderItem}
          renderAheadOffset={60 * 10}
          extendedState={this.state.extendedState}
        />
        <IndicatorModal isVisible={this.state.importEOSPrivateKeyLoading} message={intl.formatMessage({ id: 'identity_loading_hint_importing' })} onModalHide={this.onModalHide} onModalShow={this.onModalShow} />
      </View>
    )
  }
}
