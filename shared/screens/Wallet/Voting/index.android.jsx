import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { View, Text, ScrollView, Dimensions, LayoutAnimation, TouchableHighlight, ActivityIndicator, Alert, UIManager, TouchableNativeFeedback, TextInput, Keyboard, Image } from 'react-native'
import { Navigation } from 'components/Navigation'
import FastImage from 'react-native-fast-image'
import * as transactionActions from 'actions/transaction'
import * as producerActions from 'actions/producer'
import * as uiActions from 'actions/ui'
import { managingWalletSelector } from 'selectors/wallet'
import {
  producerSelector,
  producerSearchSelector,
  producerSelectedIdsSelector,
  selectedProducerSelector,
  producerAllIdsSelector,
  producerIdsSelector
} from 'selectors/producer'
import Modal from 'react-native-modal'
import Loading from 'components/Loading'
import IndicatorModal from 'components/Modal/IndicatorModal'
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview'
import SearchBar from 'components/Form/SearchBar'

const dataProvider = new DataProvider((r1, r2) => r1.key !== r2.key || r1.selected !== r2.selected)
const searchDataProvider = new DataProvider((r1, r2) => r1.key !== r2.key || r1.selected !== r2.selected)

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
    ui: state.ui,
    vote: state.vote,
    getProducer: state.getProducer,
    wallet: managingWalletSelector(state),
    producer: producerSelector(state),
    searchProducer: producerSearchSelector(state),
    selectedIds: producerSelectedIdsSelector(state),
    selected: selectedProducerSelector(state),
    allIds: producerIdsSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...transactionActions,
      ...producerActions,
      ...uiActions
    }, dispatch)
  })
)

export default class Voting extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: gt('0/30 已选节点')
        },
        drawBehind: false,
        leftButtons: [
          {
            id: 'cancel',
            icon: require('resources/images/cancel_android.png'),
            color: 'white'
          }
        ],
        rightButtons: [
          {
            id: 'vote',
            icon: require('resources/images/check_android.png'),
            enabled: false
          }
        ]
      }
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { producer, selectedIds, searchProducer } = nextProps

    const producerList = producer.map(item => ({
      key: item.owner,
      logo: item.info && item.info.org && item.info.org.branding && item.info.org.branding.logo,
      owner: item.owner,
      selected: selectedIds && selectedIds.indexOf(item.owner) !== -1,
      teamName: item.info && item.info.org && item.info.org.name,
      max_supply: item.max_supply,
      rank_url: item.rank_url,
      itemInfo: item
    }))

    const searchProducerList = searchProducer.map(item => ({
      key: item.owner,
      logo: item.info && item.info.org && item.info.org.branding && item.info.org.branding.logo,
      owner: item.owner,
      selected: selectedIds && selectedIds.indexOf(item.owner) !== -1,
      teamName: item.info && item.info.org && item.info.org.name,
      max_supply: item.max_supply,
      rank_url: item.rank_url,
      itemInfo: item
    }))

    return { dataProvider: dataProvider.cloneWithRows(producerList || []), searchDataProvider: searchDataProvider.cloneWithRows(searchProducerList || []) }
  }

  subscription = Navigation.events().bindComponent(this)

  state = {
    selected: 0,
    searching: false,
    dataProvider: dataProvider.cloneWithRows([]),
    searchDataProvider: searchDataProvider.cloneWithRows([]),
    showPrompt: false,
    password: ''
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

  tableViewRef = React.createRef()

  pendingAssetQueue = []

  navigationButtonPressed({ buttonId }) {
    const { intl } = this.props
    if (buttonId === 'cancel') {
      Navigation.dismissModal(this.props.componentId)
    } else if (buttonId === 'vote') {
      Keyboard.dismiss()
      this.requestPassword()
    } else if (buttonId === 'search') {
      Navigation.mergeOptions(this.props.componentId, {
        topBar: {
          height: 64
        }
      })
      this.props.actions.showSearchBar()
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
            { text: t(this,'button_cancel'), onPress: () => {} }
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
        this.tableViewRef.scrollToOffset(0, index * 60, true)
      } else {
        this.tableViewRef.scrollToOffset(0, index * 60, true)
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedIds && prevProps.selectedIds.length !== this.props.selectedIds.length) {
      Navigation.mergeOptions(this.props.componentId, {
        topBar: {
          title: {
            text: t(this,'{value} 已选节点',{value:`${this.props.selectedIds.length}/30`})
          },
          rightButtons: [
            {
              id: 'vote',
              icon: require('resources/images/check_android.png'),
              enabled: !!this.props.selectedIds.length
            },
            {
              id: 'search',
              icon: require('resources/images/search_android.png')
            }
          ]
        }
      })

      /* if (prevProps.selectedIds.length < this.props.selectedIds.length && this.props.selectedIds.length > 4) {
       *   console.log('scrollTo')
       *   this.scrollView.scrollTo({ x: (Dimensions.get('window').width / 4) * this.props.selectedIds.length - Dimensions.get('window').width, animated: true })
       * }*/
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
        title: {
          text: t(this,'{value} 已选节点',{value:`${this.props.selectedIds.length}/30`})
        },
        rightButtons: [
          {
            id: 'vote',
            icon: require('resources/images/check_android.png'),
            enabled: !!this.props.selectedIds.length
          },
          {
            id: 'search',
            icon: require('resources/images/search_android.png')
          }
        ]
      }
    })
  }

  componentDidDisappear() {
    this.onBackPress()

    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        rightButtons: []
      }
    })
  }

  componentDidMount() {
    this.props.actions.getProducer.requested({ json: true, limit: 500 })
    // UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true)
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
      setTimeout(() => {
        Alert.alert(
          t(this,'投票成功'),
          '',
          [
            { text: t(this,'确定'), onPress: () => {} }
          ]
        )
      }, 20)
    }
  }

  onAccessoryPress = (item) => {
    this.onBackPress()
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.ProducerDetail',
        passProps: item
      }
    })
  }

  renderItem = (type, data) => {
    return (
      <TouchableNativeFeedback onPress={this.onPress.bind(this, data.owner)} background={TouchableNativeFeedback.SelectableBackground()} useForeground={true}>
        <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 4 }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            {data.selected && <Image source={require('resources/images/circle_check_android.png')} style={{ width: 24, height: 24, marginRight: 10 }} />}
            {!data.selected && <Image source={require('resources/images/radio_unfilled_android.png')} style={{ width: 24, height: 24, marginRight: 10 }} />}
            <View style={{ width: 40, height: 40, marginRight: 10 }}>
              {!data.logo && <Image source={require('resources/images/producer.png')} style={{ width: 40, height: 40, marginRight: 10, borderRadius: 40, position: 'absolute', top: 0, left: 0 }} />}
              {data.logo && <FastImage source={{ uri: `https://storage.googleapis.com/bitportal-cms/bp/${data.logo}` }} style={{ width: 40, height: 40, marginRight: 10, borderRadius: 40, position: 'absolute', top: 0, left: 0, borderWidth: 1, borderColor: '#C8C7CE' }} />}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.87)' }} numberOfLines={1} ellipsizeMode="tail">{data.teamName || data.owner}</Text>
              <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.54)' }} numberOfLines={1} ellipsizeMode="tail">@{data.owner}</Text>
            </View>
          </View>
          <TouchableNativeFeedback onPress={this.onAccessoryPress.bind(this, data.itemInfo)} background={TouchableNativeFeedback.SelectableBackground()} useForeground={true}>
            <View style={{ width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}>
              <Image
                source={require('resources/images/more_android.png')}
                style={{ width: 24, height: 24, borderRadius: 12 }}
              />
            </View>
          </TouchableNativeFeedback>
        </View>
      </TouchableNativeFeedback>
    )
  }

  requestPassword = () => {
    this.setState({ showPrompt: true, password: '' })
  }

  changePassword = (text) => {
    this.setState({ password: text })
  }

  clearPassword = () => {
    this.setState({ password: '', showPrompt: false })
  }

  submitPassword = () => {
    this.setState({ showPrompt: false })

    this.props.actions.vote.requested({
      chain: this.props.wallet.chain,
      id: this.props.wallet.id,
      accountName: this.props.wallet.address,
      producers: this.props.selectedIds,
      password: this.state.password
    })
  }

  onBackPress = () => {
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        height: 56
      }
    })
    this.props.actions.handleProducerSearchTextChange('')
    this.props.actions.hideSearchBar()
  }

  searchBarUpdated = ({ text }) => {
    this.props.actions.handleProducerSearchTextChange(text)
  }

  searchBarCleared = () => {
    this.props.actions.handleProducerSearchTextChange('')
  }

  render() {
    const { producer, searchProducer, selectedIds, selected, vote, getProducer, ui } = this.props
    const loading = vote.loading

    if (!getProducer.loaded && getProducer.loading) {
      return (
        <Loading text={t(this,'获取节点中...')} />
      )
    }

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <Modal
          isVisible={ui.searchBarEnabled}
          backdropOpacity={0.4}
          useNativeDriver
          animationIn="fadeIn"
          animationInTiming={100}
          backdropTransitionInTiming={100}
          animationOut="fadeOut"
          animationOutTiming={100}
          backdropTransitionOutTiming={100}
          style={{ margin: 0 }}
          onBackdropPress={this.onBackPress}
        >
          <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
            <SearchBar onBackPress={this.onBackPress} searchBarUpdated={this.searchBarUpdated} searchBarCleared={this.searchBarCleared} hasSearchResult={!!searchProducer.length} />
            <View style={{ height: 60 * searchProducer.length, width: '100%', paddingHorizontal: 8, maxHeight: (Dimensions.get('window').height - 16) }}>
              <View
                style={{ flex: 1, backgroundColor: 'white', borderBottomLeftRadius: 4, borderBottomRightRadius: 4, overflow: 'hidden' }}
              >
                {!!searchProducer.length && <RecyclerListView
                                                     layoutProvider={this.layoutProvider}
                                                     dataProvider={this.state.searchDataProvider}
                                                     rowRenderer={this.renderItem}
                                                     renderAheadOffset={60 * 10}
                                                   />}
              </View>
            </View>
          </View>
        </Modal>

        <View style={{ width: '100%', height: selectedIds.length ? 80 : 0, backgroundColor: '#EEEEEE' }}>
          <ScrollView
            style={{ height: selectedIds.length ? 80 : 0 }}
            horizontal
            showsHorizontalScrollIndicator={false}
            ref={(ref) => { this.scrollView = ref; return null }}
          >
            {selected.map(item => <TouchableNativeFeedback key={item.owner} onPress={this.onSelectedPress.bind(this, item.owner)} background={TouchableNativeFeedback.SelectableBackground()} useForeground={true}>
              <View style={{ height: '100%', paddingVertical: 7, width: Dimensions.get('window').width / 4, backgroundColor: '#EEEEEE', flex: 1, justifyContent: 'space-around', alignItems: 'center', flexDirection: 'column' }}>
                <View style={{ height: '100%', width: '100%', flex: 1, justifyContent: 'space-around', alignItems: 'center', flexDirection: 'column' }}>
                  <View style={{ width: 40, height: 40 }}>
                    <Image
                      source={require('resources/images/producer.png')}
                      style={{ width: 40, height: 40, position: 'absolute', top: 0, left: 0 }}
                    />
                    {item.info && item.info.org && item.info.org.branding && item.info.org.branding.logo && <FastImage source={{ uri: `https://storage.googleapis.com/bitportal-cms/bp/${item.info && item.info.org && item.info.org.branding && item.info.org.branding.logo}` }} style={{ width: 40, height: 40, position: 'absolute', top: 0, left: 0, borderRadius: 20, borderWidth: 1, borderColor: '#C8C7CE', backgroundColor: 'white' }} />}
                  </View>
                  <Text style={{ color: 'rgba(0,0,0,0.87)', fontSize: 11 }}>{item.owner}</Text>
                  <TouchableHighlight underlayColor="rgba(0,0,0,0)" style={{ position: 'absolute', top: -2, right: 22, width: 20, height: 20, borderRadius: 10, padding: 2 }} activeOpacity={0.42} onPress={this.onPress.bind(this, item.owner)}>
                    <View style={{ backgroundColor: 'white', width: 16, height: 16, borderRadius: 8, padding: 1 }}>
                      <Image
                        source={require('resources/images/clear_grey_android.png')}
                        style={{ width: 14, height: 14 }}
                      />
                    </View>
                  </TouchableHighlight>
                </View>
              </View>
            </TouchableNativeFeedback>
             )}
          </ScrollView>
        </View>
        <RecyclerListView
          ref={(ref) => { this.tableViewRef = ref }}
          layoutProvider={this.layoutProvider}
          dataProvider={this.state.dataProvider}
          rowRenderer={this.renderItem}
          renderAheadOffset={60 * 10}
        />

        <IndicatorModal isVisible={loading} message={t(this,'投票中...')} onModalHide={this.onModalHide} />
        <Modal
          isVisible={this.state.showPrompt}
          backdropOpacity={0.6}
          useNativeDriver
          animationIn="fadeIn"
          animationInTiming={500}
          backdropTransitionInTiming={500}
          animationOut="fadeOut"
          animationOutTiming={500}
          backdropTransitionOutTiming={500}
        >
          {(this.state.showPrompt) && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 6 }}>
            <View style={{ backgroundColor: 'white', paddingTop: 14, paddingBottom: 11, paddingHorizontal: 24, borderRadius: 2, alignItem: 'center', justifyContent: 'space-between', elevation: 14, width: '100%' }}>
              <View style={{ marginBottom: 30 }}>
                <Text style={{ fontSize: 20, color: 'black', marginBottom: 12 }}>{t(this,'请输入密码')}</Text>
                {/* <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.54)', marginBottom: 12 }}>This is a prompt</Text> */}
                <TextInput
                  style={{
                    fontSize: 16,
                    padding: 0,
                    width: '100%',
                    borderBottomWidth: 2,
                    borderColor: '#169689'
                  }}
                  autoFocus={true}
                  autoCorrect={false}
                  autoCapitalize="none"
                  placeholder="Password"
                  keyboardType="default"
                  secureTextEntry={true}
                  onChangeText={this.changePassword}
                  onSubmitEditing={this.submitPassword}
                />
              </View>
              <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                <TouchableNativeFeedback onPress={this.clearPassword} background={TouchableNativeFeedback.SelectableBackground()}>
                  <View style={{ padding: 10, borderRadius: 2, marginRight: 8 }}>
                    <Text style={{ color: '#169689', fontSize: 14 }}>{t(this,'取消')}</Text>
                  </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={this.submitPassword} background={TouchableNativeFeedback.SelectableBackground()}>
                  <View style={{ padding: 10, borderRadius: 2 }}>
                    <Text style={{ color: '#169689', fontSize: 14 }}>{t(this,'确定')}</Text>
                  </View>
                </TouchableNativeFeedback>
              </View>
            </View>
          </View>}
        </Modal>
      </View>
    )
  }
}
