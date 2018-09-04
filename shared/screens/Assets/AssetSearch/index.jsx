import React, { Component } from 'react'
import Colors from 'resources/colors'
import { CommonButton } from 'components/NavigationBar'
import { Text, View, Switch, Image, FlatList } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import { FontScale } from 'utils/dimens'
import * as eosAssetActions from 'actions/eosAsset'
import { eosAssetSearchListSelector } from 'selectors/eosAsset'
import Images from 'resources/images'
import SearchBar from './SearchBar'
import messages from 'resources/messages'
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
    eosAssetSearchList: eosAssetSearchListSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...eosAssetActions
    }, dispatch)
  }),
  null,
  { withRef: true }
)

export default class AssetSearch extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  // 激活或隐藏钱包
  onValueChange = (value, item) => {
    const { eosAccountName } = this.props
    this.props.actions.saveAssetPref({ value, symbol: item.symbol, eosAccountName })
  }

  cancelSearch = () => {
    this.props.actions.resetSearchValue()
    Navigation.pop(this.props.componentId)
  }

  keyExtractor = item => String(item.id)

  ItemSeparatorComponent = () => <View style={{ height: 1, width: '100%', backgroundColor: Colors.bgColor_000000 }} />

  renderItem = ({ item }) => (
    <AssetElement item={item} onValueChange={e => this.onValueChange(e, item)} />
  )

  render() {
    const { locale, searchValue, eosAssetSearchList } = this.props

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <View style={[styles.navContainer, styles.between, { alignItems: 'flex-end' }]}>
            <SearchBar value={searchValue} />
            <CommonButton
              title={messages[locale].astsch_title_name_cancel}
              onPress={this.cancelSearch}
              extraTextStyle={{ fontSize: FontScale(18), color: Colors.textColor_89_185_226 }}
            />
          </View>
          <View style={styles.scrollContainer}>
            <FlatList
              data={eosAssetSearchList.toJS()}
              keyExtractor={this.keyExtractor}
              ItemSeparatorComponent={this.renderSeparator}
              showsVerticalScrollIndicator={false}
              renderItem={this.renderItem}
            />
          </View>
        </View>
      </IntlProvider>
    )
  }
}
