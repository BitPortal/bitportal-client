import React, { Component } from 'react'
import Colors from 'resources/colors'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { Text, View, ScrollView, Switch, Image } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import * as eosAssetActions from 'actions/eosAsset'

import storage from 'utils/storage'
import Images from 'resources/images'
import messages from './messages'
import styles from './styles'

const AssetElement = ({ item, onValueChange }) => (
  <View
    style={[
      styles.listContainer,
      styles.between,
      { paddingHorizontal: 32, backgroundColor: Colors.bgColor_48_49_59 }
    ]}
  >
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Image
        style={styles.icon}
        source={
          item.icon_url ? { uri: `${item.icon_url}` } : Images.coin_logo_default
        }
      />
      <Text style={styles.text20}>
        {'   '}
        {item.symbol}
      </Text>
    </View>
    <Switch value={true} onValueChange={e => onValueChange(e, item)} />
  </View>
)

@connect(
  state => ({
    locale: state.intl.get('locale'),
    eosAsset: state.eosAsset.get('data')
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        ...eosAssetActions
      },
      dispatch
    )
  }),
  null,
  { withRef: true }
)
export default class AvailableAssets extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  state = {
    assetList: []
  }
  //{symbol:TEST, value:true}

  async UNSAFE_componentWillMount() {
    const { eosAsset } = this.props
    this.props.actions.getEosAssetRequested({})
    const tempArr = eosAsset
      .toJS()
      .map(item => ({ symbol: item.symbol, value: false }))
    this.setState({ assetList: tempArr })
    this.handleAssetList()
  }

  // async componentDidMount() {
  //   const accountName = this.props.eosAccount.get('data').get('account_name')
  //   const objInfo = await storage.getItem(
  //     `bitportal.${accountName}-contacts`,
  //     true
  //   )
  //   const contacts = objInfo && objInfo.contacts
  //   if (contacts && contacts.length > 0) {
  //     this.setState({ contacts })
  //   }
  // }

  handleAssetList = async () => {
    const eosAssetListPrefs = await storage.getItem('eosAssetListPrefs', false)
    console.log('eosAssetListPrefs', eosAssetListPrefs)
    if (eosAssetListPrefs) {
      this.setState({ assetList: eosAssetListPrefs })
    } else {
      const tempArr = this.props.eosAsseet
        .toJS()
        .map(item => ({ symbol: item.symbol, value: false }))
    }
  }

  // 激活或隐藏钱包
  onValueChange = (value, item) => {
    item.value = value
    this.setState(prevState => ({ assetsList: prevState.assetsList }))
  }

  render() {
    const { locale } = this.props
    console.log('this.props.eosAsset', this.props.eosAsset.toJS())
    const { eosAsset } = this.props
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            leftButton={
              <CommonButton
                iconName="md-arrow-back"
                onPress={() => Navigation.pop(this.props.componentId)}
              />
            }
            title={messages[locale].astlist_title_name_astlst}
          />
          <View style={styles.scrollContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {eosAsset
                .toJS()
                .map((item, index) => (
                  <AssetElement
                    key={index}
                    item={item}
                    onValueChange={(e, item) => this.onValueChange(e, item)}
                  />
                ))}
            </ScrollView>
          </View>
        </View>
      </IntlProvider>
    )
  }
}
