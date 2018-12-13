import React, { Component } from 'react'
import Colors from 'resources/colors'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { Text, View, Switch, ActivityIndicator } from 'react-native'
import BPImage from 'components/BPNativeComponents/BPImage'
import { Navigation } from 'react-native-navigation'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import * as eosAssetActions from 'actions/eosAsset'
import { eosAssetSearchResultListSelector } from 'selectors/eosAsset'
import Images from 'resources/images'
import { RecyclerListView, LayoutProvider } from 'recyclerlistview'
import SearchEOSAssetForm from 'components/Form/SearchEOSAssetForm'
import ImmutableDataProvider from 'utils/immutableDataProvider'
import { SCREEN_WIDTH } from 'utils/dimens'
import messages from 'resources/messages'
import styles from './styles'

const AssetElement = ({ item, onToggle }) => (
  <View style={[styles.listContainer, styles.between, { paddingHorizontal: 20, backgroundColor: Colors.bgColor_30_31_37 }]}>
    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
      <BPImage style={styles.icon} source={item.get('icon_url') ? { uri: `${item.get('icon_url')}` } : Images.coin_logo_default} />
      <View>
        <Text style={styles.text20}>{item.get('symbol')}</Text>
        <Text style={styles.text16}>{item.get('account')}</Text>
      </View>
    </View>
    <Switch
      value={item.get('selected')}
      onValueChange={onToggle}
    />
  </View>
)

const dataProvider = new ImmutableDataProvider((r1, r2) => r1.get('account') !== r2.get('account') || r1.get('symbol') !== r2.get('symbol') || r1.get('selected') !== r2.get('selected'))

@connect(
  state => ({
    locale: state.intl.get('locale'),
    eosAssetList: eosAssetSearchResultListSelector(state),
    searching: state.eosAsset.get('searching')
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...eosAssetActions
    }, dispatch)
  }),
  null,
  { withRef: true }
)

export default class AssetsSearch extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  static getDerivedStateFromProps(props) {
    return {
      eosAssetList: dataProvider.cloneWithRows(props.eosAssetList)
    }
  }

  state = {
    eosAssetList: dataProvider.cloneWithRows(this.props.eosAssetList)
  }

  layoutProvider = new LayoutProvider(
    index => index % 3,
    (type, dim) => {
      dim.width = SCREEN_WIDTH
      dim.height = 70
    }
  )

  onToggle = (item) => {
    const contract = item.get('account')
    const symbol = item.get('symbol')
    const current_supply = item.get('current_supply')
    const max_supply = item.get('max_supply')
    const icon_url = item.get('icon_url')
    this.props.actions.toggleEOSAsset({ contract, symbol, current_supply, max_supply, icon_url})
  }

  renderItem = (type, item) => (
    <AssetElement item={item} onToggle={() => this.onToggle(item)} />
  )

  componentWillUnmount() {
    this.props.actions.clearSearch()
  }

  render() {
    const { locale, searching } = this.props
    const { eosAssetList } = this.state
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale].assets_list_title_token_list}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.dismissModal(this.props.componentId)} extraStyle={{ minWidth: 70 }} />}
            rightButton={<SearchEOSAssetForm />}
          />
          <View style={styles.scrollContainer}>
            {!searching ? <RecyclerListView layoutProvider={this.layoutProvider} dataProvider={eosAssetList} rowRenderer={this.renderItem} /> : <ActivityIndicator size="small" color="white" style={{ marginTop: 20 }} />}
          </View>
        </View>
      </IntlProvider>
    )
  }
}
