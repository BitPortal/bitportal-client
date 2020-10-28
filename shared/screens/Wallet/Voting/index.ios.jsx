import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { View, Text, ScrollView, Dimensions, LayoutAnimation, TouchableHighlight, ActivityIndicator, Alert, SafeAreaView, NativeModules } from 'react-native'
import { Navigation } from 'components/Navigation'
import TableView from 'components/TableView'
import FastImage from 'react-native-fast-image'
import * as transactionActions from 'actions/transaction'
import * as producerActions from 'actions/producer'
import * as accountActions from 'actions/account'
import { managingWalletSelector } from 'selectors/wallet'
import { managingAccountSelector } from 'selectors/account'
import {
  producerWithSearchSelector,
  producerSelectedIdsSelector,
  selectedProducerSelector,
  producerAllIdsSelector,
  producerIdsSelector
} from 'selectors/producer'
import Modal from 'react-native-modal'
import styles from './styles'
const SPAlert = NativeModules.SPAlert

export const errorMessages = (error, messages) => {
  if (!error) { return null }

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'Invalid password':
      return gt('密码错误')
    case 'EOS System Error':
      return gt('EOS系统错误')
    default:
      return gt('投票失败')
  }
}

export const errorDetail = (error) => {
  if (!error) { return null }

  const detail = typeof error === 'object' ? error.detail : ''

  return detail
}

@injectIntl

@connect(
  state => ({
    vote: state.vote,
    getProducer: state.getProducer,
    wallet: managingWalletSelector(state),
    producer: producerWithSearchSelector(state),
    selectedIds: producerSelectedIdsSelector(state),
    selected: selectedProducerSelector(state),
    allIds: producerIdsSelector(state),
    account: managingAccountSelector(state),
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...transactionActions,
      ...producerActions,
      ...accountActions
    }, dispatch)
  })
)

export default class Voting extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: gt('EOS节点投票'),
          fontWeight: '400'
        },
        subtitle: {
          text: gt('0 / 30 已选'),
          fontSize: 11
        },
        drawBehind: false,
        searchBar: true,
        searchBarHiddenWhenScrolling: true,
        searchBarPlaceholder: 'Search',
        hideNavBarOnFocusSearchBar: false,
        largeTitle: {
          visible: false
        },
        leftButtons: [
          {
            id: 'cancel',
            text: gt('取消')
          }
        ],
        rightButtons: [
          {
            id: 'vote',
            text: gt('投票'),
            fontWeight: '400',
            enabled: false
          }
        ]
      },
      bottomTabs: {
        visible: false
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  state = { selected: 0, searching: false, searchBarFocused: false }

  tableViewRef = React.createRef()

  pendingAssetQueue = []

  navigationButtonPressed({ buttonId }) {
    const { intl } = this.props
    if (buttonId === 'cancel') {
      Navigation.dismissModal(this.props.componentId)
    } else if (buttonId === 'vote') {
      Alert.prompt(
        intl.formatMessage({ id: 'alert_input_wallet_password' }),
        null,
        [
          {
            text: intl.formatMessage({ id: 'alert_button_cancel' }),
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
          },
          {
            text: intl.formatMessage({ id: 'alert_button_confirm' }),
            onPress: password => this.props.actions.vote.requested({
              chain: this.props.wallet.chain,
              id: this.props.wallet.id,
              accountName: this.props.wallet.address,
              producers: this.props.selectedIds,
              password
            })
          }
        ],
        'secure-text'
      )
    }
  }

  searchBarUpdated({ text, isFocused }) {
    this.setState({ searchBarFocused: isFocused })

    this.setState({ searching: isFocused })

    if (isFocused) {
      this.props.actions.handleProducerSearchTextChange(text)
    } else {
      this.props.actions.handleProducerSearchTextChange('')
    }
  }

  onRefresh = () => {
    this.props.actions.getProducer.refresh({ json: true, limit: 500 })
  }

  onPress = (owner) => {
    if (this.props.selectedIds.length === 30) {
      const index = this.props.selectedIds.findIndex(item => item === owner)
      if (index === -1) {
        Alert.alert(
          t(this,'最多可选30个节点'),
          '',
          [
            { text: t(this,'确定'), onPress: () => {} }
          ]
        )
      } else {
        this.props.actions.toggleSelect(owner)
      }
    } else {
      this.props.actions.toggleSelect(owner)
    }
  }

  onSelectedPress = (owner) => {
    const index = this.props.allIds.findIndex(item => item === owner)

    if (index !== -1) {
      if (index < 21) {
        this.tableViewRef.scrollToIndex({ index, section: 0, animated: true })
      } else {
        this.tableViewRef.scrollToIndex({ index: index - 21, section: 1, animated: true })
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedIds && prevProps.selectedIds.length !== this.props.selectedIds.length) {
      Navigation.mergeOptions(this.props.componentId, {
        topBar: {
          subtitle: {
            text: t(this,'{value} 已选',{value:`${this.props.selectedIds.length} / 30`}),
            fontSize: 11
          },
          rightButtons: [
            {
              id: 'vote',
              text: gt('投票'),
              fontWeight: '400',
              enabled: !!this.props.selectedIds.length
            }
          ]
        }
      })

      setTimeout(() => {
        if (this.scrollView && prevProps.selectedIds.length && prevProps.selectedIds.length < this.props.selectedIds.length && this.props.selectedIds.length > 4) {
          this.scrollView.scrollToEnd({ animated: true })
        }
      })
    }
    LayoutAnimation.easeInEaseOut()
  }

  componentDidAppear() {
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        subtitle: {
          text: t(this,'{value} 已选',{value:`${this.props.selectedIds.length} / 30`}),
          fontSize: 11
        },
        rightButtons: [
          {
            id: 'vote',
            text: gt('投票'),
            fontWeight: '400',
            enabled: !!this.props.selectedIds.length
          }
        ]
      }
    })
  }

  componentDidMount() {
    this.props.actions.getProducer.requested({ json: true, limit: 500 })

    /* if (!this.props.account && this.props.wallet.address && this.props.wallet.chain) {
     *   this.props.actions.getAccount.requested({ chain: this.props.wallet.chain, address: this.props.wallet.address, refreshProducer: true })
     * }*/
  }

  componentWillUnmount() {
    this.props.actions.setSelected([])
    this.props.actions.handleProducerSearchTextChange('')
  }

  onModalHide = () => {
    const error = this.props.vote.error

    if (error) {
      setTimeout(() => {
        Alert.alert(
          errorMessages(error),
          errorDetail(error),
          [
            { text: t(this,'确定'), onPress: () =>this.props.actions.vote.clearError() }
          ]
        )
      }, 20)
    } else {
      SPAlert.presentDone(t(this,'投票成功'))
    }
  }

  onAccessoryPress = (item) => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.ProducerDetail',
        passProps: item
      }
    })
  }

  render() {
    const { producer, selectedIds, selected, vote, getProducer, statusBarHeight } = this.props
    const loading = vote.loading
    const refreshing = getProducer.refreshing
    console.log('selectedIds', selectedIds)

    if (!getProducer.loaded && getProducer.loading) {
      return (
        <View style={styles.container}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <ActivityIndicator size="small" color="#000000" />
            <Text style={{ fontSize: 17, marginLeft: 5 }}>{t(this,'获取节点中...')}</Text>
          </View>
        </View>
      )
    }

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <View style={{ width: '100%', height: selectedIds.length ? 80 : 0 }}>
            <ScrollView
              style={{ height: selectedIds.length ? 80 : 0 }}
              horizontal
              showsHorizontalScrollIndicator={false}
              ref={(ref) => { this.scrollView = ref; return null }}
            >
              {selected.map(item => <TouchableHighlight key={item.owner} underlayColor="rgba(0,0,0,0)" onPress={this.onSelectedPress.bind(this, item.owner)} style={{ height: 66, width: Dimensions.get('window').width / 4, backgroundColor: 'white', marginTop: 7, flex: 1, justifyContent: 'space-around', alignItems: 'center', flexDirection: 'column' }}>
                <View style={{ height: '100%', width: '100%', flex: 1, justifyContent: 'space-around', alignItems: 'center', flexDirection: 'column' }}>
                  <View style={{ width: 40, height: 40 }}>
                    <FastImage
                      source={require('resources/images/producer.png')}
                      style={{ width: 40, height: 40, position: 'absolute', top: 0, left: 0 }}
                    />
                    {item.info && item.info.org && item.info.org.branding && item.info.org.branding.logo && <FastImage source={{ uri: `https://storage.googleapis.com/bitportal-cms/bp/${item.info && item.info.org && item.info.org.branding && item.info.org.branding.logo}` }} style={{ width: 40, height: 40, position: 'absolute', top: 0, left: 0, borderRadius: 20, borderWidth: 1, borderColor: '#C8C7CE', backgroundColor: 'white' }} />}
                  </View>
                  <Text style={{ color: 'black', fontSize: 11 }}>{item.owner}</Text>
                  <TouchableHighlight underlayColor="rgba(0,0,0,0)" style={{ position: 'absolute', top: -2, right: 22, width: 20, height: 20, borderRadius: 10, padding: 2 }} activeOpacity={0.42} onPress={this.onPress.bind(this, item.owner)}>
                    <View style={{ backgroundColor: 'white', width: 16, height: 16, borderRadius: 8, padding: 1 }}>
                      <FastImage
                        source={require('resources/images/clear.png')}
                        style={{ width: 14, height: 14 }}
                      />
                    </View>
                  </TouchableHighlight>
                </View>
              </TouchableHighlight>
              )}
            </ScrollView>
          </View>
          <TableView
            style={{ flex: 1 }}
            tableViewCellStyle={TableView.Consts.CellStyle.Default}
            canRefresh={!this.state.searchBarFocused}
            refreshing={refreshing}
            onRefresh={this.state.searchBarFocused ? () => {} : this.onRefresh}
            detailTextColor="#666666"
            showsVerticalScrollIndicator={false}
            cellSeparatorInset={{ left: 46 }}
            reactModuleForCell="ProducerTableViewCell"
            headerBackgroundColor="#F7F7F7"
            ref={(ref) => { this.tableViewRef = ref; return null }}
          >
            <TableView.Section label={t(this,'当前出块节点')}>
              {producer.slice(0, 21).map(item => (
                <TableView.Item
                  key={item.owner}
                  height={60}
                  selectionStyle={TableView.Consts.CellSelectionStyle.None}
                  logo={item.info && item.info.org && item.info.org.branding && item.info.org.branding.logo}
                  owner={item.owner}
                  selected={item.selected}
                  selectedAccessoryImage={require('resources/images/circle_selected_accessory.png')}
                  leftAccessoryImage={true}
                  cellHeight={60}
                  teamName={item.info && item.info.org && item.info.org.name}
                  max_supply={item.max_supply}
                  rank_url={item.rank_url}
                  onPress={this.onPress.bind(this, item.owner)}
                  accessoryType={TableView.Consts.AccessoryType.DetailButton}
                  onAccessoryPress={this.onAccessoryPress.bind(this, item)}
                />
              ))}
            </TableView.Section>
            <TableView.Section label={t(this,'备选节点')}>
              {producer.slice(21, -1).map(item => (
                <TableView.Item
                  key={item.owner}
                  height={60}
                  selectionStyle={TableView.Consts.CellSelectionStyle.None}
                  logo={item.info && item.info.org && item.info.org.branding && item.info.org.branding.logo}
                  owner={item.owner}
                  selected={item.selected}
                  selectedAccessoryImage={require('resources/images/circle_selected_accessory.png')}
                  leftAccessoryImage={true}
                  cellHeight={60}
                  teamName={item.info && item.info.org && item.info.org.name}
                  max_supply={item.max_supply}
                  rank_url={item.rank_url}
                  onPress={this.onPress.bind(this, item.owner)}
                  accessoryType={TableView.Consts.AccessoryType.DetailButton}
                  onAccessoryPress={this.onAccessoryPress.bind(this, item)}
                />
              ))}
            </TableView.Section>
          </TableView>
          <Modal
            isVisible={loading}
            backdropOpacity={0.4}
            useNativeDriver
            animationIn="fadeIn"
            animationInTiming={200}
            backdropTransitionInTiming={200}
            animationOut="fadeOut"
            animationOutTiming={200}
            backdropTransitionOutTiming={200}
            onModalHide={this.onModalHide}
          >
            {loading && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 14, alignItem: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                <ActivityIndicator size="small" color="#000000" />
                <Text style={{ fontSize: 17, marginLeft: 10, fontWeight: 'bold' }}>{t(this,'投票中...')}</Text>
              </View>
            </View>}
          </Modal>
        </View>
      </SafeAreaView>
    )
  }
}
