import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { View, Text, ScrollView, Dimensions, LayoutAnimation, TouchableHighlight, AlertIOS, ActivityIndicator, Alert } from 'react-native'
import { Navigation } from 'react-native-navigation'
import TableView from 'react-native-tableview'
import FastImage from 'react-native-fast-image'
import * as transactionActions from 'actions/transaction'
import * as producerActions from 'actions/producer'
import { managingWalletSelector } from 'selectors/wallet'
import {
  producerSelector,
  producerSelectedIdsSelector,
  producerAllIdsSelector,
  selectedProducerSelector
} from 'selectors/producer'
import Modal from 'react-native-modal'
import styles from './styles'

export const errorMessages = (error, messages) => {
  if (!error) { return null }

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'Invalid password':
      return '密码错误'
    case 'EOS System Error':
      return 'EOS系统错误'
    default:
      return '投票失败'
  }
}

export const errorDetail = (error) => {
  if (!error) { return null }

  const detail = typeof error === 'object' ? error.detail : ''

  return detail
}

@connect(
  state => ({
    vote: state.vote,
    wallet: managingWalletSelector(state),
    producer: producerSelector(state),
    selectedIds: producerSelectedIdsSelector(state),
    selected: selectedProducerSelector(state),
    allIds: producerAllIdsSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...transactionActions,
      ...producerActions
    }, dispatch)
  })
)

export default class Voting extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: 'EOS节点投票'
        },
        subtitle: {
          text: '0 / 30 已选'
        },
        drawBehind: false,
        searchBar: true,
        searchBarHiddenWhenScrolling: true,
        searchBarPlaceholder: 'Search',
        largeTitle: {
          visible: false
        },
        leftButtons: [
          {
            id: 'cancel',
            text: '取消'
          }
        ],
        rightButtons: [
          {
            id: 'vote',
            text: '投票',
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

  state = { selected: 0 }

  tableViewRef = React.createRef()

  pendingAssetQueue = []

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'cancel') {
      Navigation.dismissModal(this.props.componentId);
    } else if (buttonId === 'vote') {
      AlertIOS.prompt(
        '请输入钱包密码',
        null,
        [
          {
            text: '取消',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
          },
          {
            text: '确认',
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

  searchBarUpdated() {
    // this.setState({ searching: isFocused })
  }

  onRefresh = () => {
    this.props.actions.getProducer.refresh({ json: true, limit: 500 })
  }

  onPress = (owner) => {
    if (this.props.selectedIds.length === 30) {
      const index = this.props.selectedIds.findIndex(item => item === owner)
      if (index === -1) {
        Alert.alert(
          '最多可选30个节点',
          '',
          [
            { text: '确定', onPress: () => {} }
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
            text: `${this.props.selectedIds.length} / 30 已选`
          },
          rightButtons: [
            {
              id: 'vote',
              text: '投票',
              fontWeight: '400',
              enabled: !!this.props.selectedIds.length
            }
          ]
        }
      })

      if (prevProps.selectedIds.length < this.props.selectedIds.length && this.props.selectedIds.length > 4) {
        this.scrollView.scrollTo({ x: (Dimensions.get('window').width / 4) * this.props.selectedIds.length - Dimensions.get('window').width, animated: true })
      }
    }

    LayoutAnimation.easeInEaseOut()
  }

  componentDidAppear() {
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        subtitle: {
          text: `${this.props.selectedIds.length} / 30 已选`
        },
        rightButtons: [
          {
            id: 'vote',
            text: '投票',
            fontWeight: '400',
            enabled: !!this.props.selectedIds.length
          }
        ]
      }
    })
  }

  componentDidMount() {
    this.props.actions.getProducer.requested({ json: true, limit: 500 })
  }

  componentWillUnmount() {
    this.props.actions.setSelected([])
  }

  onModalHide = () => {
    const error = this.props.vote.error

    if (error) {
      setTimeout(() => {
        Alert.alert(
          errorMessages(error),
          errorDetail(error),
          [
            { text: '确定', onPress: () =>this.props.actions.vote.clearError() }
          ]
        )
      }, 20)
    } else {
      setTimeout(() => {
        Alert.alert(
          '投票成功',
          '',
          [
            { text: '确定', onPress: () => {} }
          ]
        )
      }, 20)
    }
  }

  render() {
    const { producer, selectedIds, selected, vote } = this.props
    const loading = vote.loading

    return (
      <View style={styles.container}>
        <View style={[styles.selected, { marginTop: Navigation.constants().topBarHeight, height: selectedIds.length ? 80 : 0 }]}>
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
          style={styles.tableView}
          tableViewCellStyle={TableView.Consts.CellStyle.Default}
          detailTextColor="#666666"
          canRefresh
          showsVerticalScrollIndicator={false}
          cellSeparatorInset={{ left: 46 }}
          reactModuleForCell="ProducerTableViewCell"
          headerBackgroundColor="#F7F7F7"
          ref={(ref) => { this.tableViewRef = ref; return null }}
        >
          <TableView.Section label="当前出块节点">
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
               />
             ))}
          </TableView.Section>
          <TableView.Section label="备选节点">
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
              <Text style={{ fontSize: 17, marginLeft: 10, fontWeight: 'bold' }}>投票中...</Text>
            </View>
          </View>}
        </Modal>
      </View>
    )
  }
}
