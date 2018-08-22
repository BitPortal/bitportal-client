import React, { Component } from 'react'
import Colors from 'resources/colors'
import NavigationBar, { CommonButton, CommonRightButton } from 'components/NavigationBar'
import { Text, View, Switch, Image, FlatList } from 'react-native'
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
  <View style={[styles.listContainer, styles.between, { paddingHorizontal: 32, backgroundColor: Colors.bgColor_30_31_37 }]}>
    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
      <Image style={styles.icon} source={item.icon_url ? { uri: `${item.icon_url}` } : Images.coin_logo_default} />
      <View>
        <Text style={styles.text20}>{item.symbol}</Text>
        <Text style={styles.text16}>{item.account}</Text>
      </View>
    </View>
    <Switch
      value={item.value}
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

  goSearching = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.AssetSearch',
        passProps: {
          eosAccountName: this.props.eosAccountName
        }
      }
    })
  }

  // 激活或隐藏钱包
  onValueChange = (value, item) => {
    const { eosAccountName } = this.props
    this.props.actions.saveAssetPref({ value, symbol: item.symbol, eosAccountName })
  }

  onRefresh = () => this.props.actions.getEOSAssetRequested({})

  keyExtractor = item => String(item.id)

  ItemSeparatorComponent = () => <View style={{ height: 1, width: '100%', backgroundColor: Colors.bgColor_000000 }} />

  renderItem = ({ item }) => (
    <AssetElement item={item} onValueChange={e => this.onValueChange(e, item)} />
  )

  render() {
    const { locale, eosAssetPrefs } = this.props

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale].astlist_title_name_astlst}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
            rightButton={<CommonRightButton iconName="ios-search-outline" onPress={this.goSearching} />}
          />
          <View style={styles.scrollContainer}>
            <FlatList
              data={eosAssetPrefs.toJS()}
              keyExtractor={this.keyExtractor}
              ItemSeparatorComponent={this.renderSeparator}
              showsVerticalScrollIndicator={false}
              renderItem={this.renderItem}
              onRefresh={this.onRefresh}
              refreshing={this.props.loading}
            />
          </View>
        </View>
      </IntlProvider>
    )
  }
}
