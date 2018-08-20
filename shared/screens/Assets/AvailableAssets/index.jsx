import React, { Component } from 'react'
import Colors from 'resources/colors'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import {
  Text,
  View,
  ScrollView,
  Switch,
  Image,
  ActivityIndicator
} from 'react-native'
import { Navigation } from 'react-native-navigation'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import * as eosAssetActions from 'actions/eosAsset'
import { eosAssetListSelector } from 'selectors/eosAsset'

import Images from 'resources/images'
import messages from './messages'
import styles from './styles'

const AssetElement = ({ item, onValueChange }) => (
  <View style={[ styles.listContainer, styles.between, { paddingHorizontal: 32, backgroundColor: Colors.bgColor_48_49_59 }]}>
    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
      <Image style={styles.icon} source={ item.get('icon_url') ? { uri: `${item.get('icon_url')}` } : Images.coin_logo_default }/>
      <Text style={styles.text20}>
        {'   '}
        {item.get('symbol')}
      </Text>
    </View>
    <Switch
      value={item.get('value')}
      onValueChange={e => onValueChange(e, item)}
    />
  </View>
)

@connect(
  state => ({
    locale: state.intl.get('locale'),
    loading: state.eosAsset.get('loading'),
    eosAssetPrefs: eosAssetListSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
        ...eosAssetActions 
    }, dispatch)
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

  async UNSAFE_componentWillMount() {
    this.props.actions.getEOSAssetRequested({})
  }

  // 激活或隐藏钱包
  onValueChange = (value, item) => {
    this.props.actions.saveAssetPref({ value, symbol: item.get('symbol') })
  }

  render() {
    const { locale, loading, eosAssetPrefs } = this.props

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale].astlist_title_name_astlst}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)}/>}
          />
          <View style={styles.scrollContainer}>
            {loading && <ActivityIndicator size="small" color="white" />}
            <ScrollView showsVerticalScrollIndicator={false}>
              {eosAssetPrefs.map((item, index) => (
                <AssetElement
                  key={index}
                  item={item}
                  onValueChange={(e, item) => this.onValueChange(e, item)}
                />
              ))}
            </ScrollView>
            )
          </View>
        </View>
      </IntlProvider>
    )
  }
}
