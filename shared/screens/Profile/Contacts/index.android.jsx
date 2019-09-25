import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, Text, TouchableNativeFeedback, Image, Dimensions } from 'react-native'
import { injectIntl } from 'react-intl'
import { Navigation } from 'components/Navigation'
import { contactSelector } from 'selectors/contact'
import * as contactActions from 'actions/contact'
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview'
import { walletIcons } from 'resources/images'

const dataProvider = new DataProvider((r1, r2) => r1.key !== r2.key)

@connect(
  state => ({
    contact: contactSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...contactActions
    }, dispatch)
  })
)

export default class Contacts extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: '联系人'
        },
        leftButtons: [
          {
            id: 'cancel',
            icon: require('resources/images/cancel_android.png'),
            color: 'white'
          }
        ]
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  layoutProvider = new LayoutProvider(
    index => {
      return 0
    },
    (type, dim) => {
      dim.width = Dimensions.get('window').width
      dim.height = 60
    }
  )

  state = {
    dataProvider: dataProvider.cloneWithRows([]),
    editting: false
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { contact } = nextProps

    let contacts = []

    contact.forEach(section => {
      section.items.forEach(item => {
        contacts.push({
          key: item.id,
          id: item.id,
          name: item.name,
          description: item.description,
          hasBTC: !!item.btc && !!item.btc.length,
          hasETH: !!item.eth && !!item.eth.length,
          hasEOS: !!item.eos && !!item.eos.length
        })
      })
    })

    return { dataProvider: dataProvider.cloneWithRows(contacts) }
  }

  navigationButtonPressed({ buttonId }) {
    switch (buttonId) {
      case 'cancel':
        Navigation.dismissModal(this.props.componentId)
        break
      default:
    }
  }

  onItemNotification = (data) => {
    const { action } = data

    if (action === 'toManageWallet') {
      Navigation.push(this.props.componentId, {
        component: {
          name: 'BitPortal.ManageWallet'
        }
      })
    }
  }

  onChange = (data) => {
    console.log(data)
  }

  onPress = (id) => {
    this.props.actions.setActiveContact(id)

    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.Contact'
      }
    })
  }

  renderItem = (type, data) => {
    return (
      <TouchableNativeFeedback onPress={this.onPress.bind(this, data.id)} background={TouchableNativeFeedback.SelectableBackground()} useForeground={true}>
        <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 16 }}>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Image
              source={require('resources/images/profile_placeholder_android.png')}
              style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.2)', marginRight: 16 }}
            />
            <View style={{ flex: 1, borderWidth: 0, borderColor: 'red', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
              <View style={{ flex: 1, borderWidth: 0, borderColor: 'red', justifyContent: 'center', paddingRight: 16 }}>
                <Text style={{ fontSize: 17, color: 'rgba(0,0,0,0.87)', marginRight: 5 }} numberOfLines={1}>{data.name}</Text>
                {data.description && <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.54)', paddingTop: 2 }} numberOfLines={1}>{data.description}</Text>}
              </View>
              <View style={{ width: 60, height: 60 }}>
                {data.hasEOS && <View style={{ backgroundColor: 'white', width: 30, height: 30, borderRadius: 20, position: 'absolute', top: 15, right: (data.hasBTC && data.hasETH) ? 36 : ((!data.hasBTC && !data.hasETH) ? -8 : 14) }}>
                  <Image
                    source={walletIcons['eos']}
                    style={{ backgroundColor: 'white', width: '100%', height: '100%', borderRadius: 20, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.2)' }}
                  />
                </View>}
            {data.hasETH && <View style={{ backgroundColor: 'white', width: 30, height: 30, borderRadius: 20, position: 'absolute', top: 15, right: data.hasBTC ? 14 : -8 }}>
                  <Image
                    source={walletIcons['ethereum']}
                    style={{ backgroundColor: 'white', width: '100%', height: '100%', borderRadius: 20, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.2)' }}
                  />
            </View>}
            {data.hasBTC && <View style={{ backgroundColor: 'white', width: 30, height: 30, borderRadius: 20, position: 'absolute', top: 15, right: -8 }}>
              <Image
                source={walletIcons['bitcoin']}
                style={{ backgroundColor: 'white', width: '100%', height: '100%', borderRadius: 20, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.2)' }}
              />
            </View>}
              </View>
            </View>
          </View>
        </View>
      </TouchableNativeFeedback>
    )
  }

  onAddContact = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.EditContact',
        options: {
          topBar: {
            title: {
              text: '创建联系人'
            }
          }
        }
      }
    })
  }

  render() {
    const { contact } = this.props

    if (!contact || !contact.length) {
      return (
        <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: 'rgba(0,0,0,0.54)', fontSize: 17 }}>暂无联系人</Text>
          <TouchableNativeFeedback onPress={this.onAddContact} background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.12)', true)} useForeground={true}>
            <View style={{ width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: 16, right: 16, backgroundColor: '#FF5722', elevation: 10, zIndex: 2 }}>
              <Image
                source={require('resources/images/add_white_android.png')}
                style={{ width: 24, height: 24 }}
              />
            </View>
          </TouchableNativeFeedback>
        </View>
      )
    }

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <RecyclerListView
          layoutProvider={this.layoutProvider}
          dataProvider={this.state.dataProvider}
          rowRenderer={this.renderItem}
          renderAheadOffset={60 * 10}
        />
        <TouchableNativeFeedback onPress={this.onAddContact} background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.12)', true)} useForeground={true}>
          <View style={{ width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: 16, right: 16, backgroundColor: '#FF5722', elevation: 10, zIndex: 2 }}>
            <Image
              source={require('resources/images/add_white_android.png')}
              style={{ width: 24, height: 24 }}
            />
          </View>
        </TouchableNativeFeedback>
      </View>
    )
  }
}
