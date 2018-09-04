import React, { Component } from 'react'
import Colors from 'resources/colors'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { Text, View, Switch, Image, RefreshControl } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import * as eosAssetActions from 'actions/eosAsset'
import { eosAssetListSelector } from 'selectors/eosAsset'
import Images from 'resources/images'
import { RecyclerListView, LayoutProvider } from 'recyclerlistview'
import ImmutableDataProvider from 'utils/immutableDataProvider'
import { SCREEN_WIDTH } from 'utils/dimens'
import messages from 'resources/messages'
import styles from './styles'

const AssetElement = ({ item, onToggle }) => (
  <View style={[styles.listContainer, styles.between, { paddingHorizontal: 32, backgroundColor: Colors.bgColor_30_31_37 }]}>
    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
      <Image style={styles.icon} source={item.icon_url ? { uri: `${item.icon_url}` } : Images.coin_logo_default} />
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
    eosAssetList: eosAssetListSelector(state),
    loading: state.eosAsset.get('loading'),
    loaded: state.eosAsset.get('loaded')
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

  componentDidMount() {
    this.props.actions.getEOSAssetRequested()
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

  onToggle = (item) => {
    const contract = item.get('account')
    const symbol = item.get('symbol')
    this.props.actions.toggleEOSAsset({ contract, symbol })
  }

  onRefresh = () => this.props.actions.getEOSAssetRequested()

  renderItem = (type, item) => (
    <AssetElement item={item} onToggle={() => this.onToggle(item)} />
  )

  render() {
    const { locale, loading, loaded } = this.props
    const { eosAssetList } = this.state

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale].astlist_title_name_astlst}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
          />
          <View style={styles.scrollContainer}>
            <RecyclerListView
              refreshControl={<RefreshControl onRefresh={this.onRefresh} refreshing={loading && !loaded} />}
              layoutProvider={this.layoutProvider}
              dataProvider={eosAssetList}
              rowRenderer={this.renderItem}
            />
          </View>
        </View>
      </IntlProvider>
    )
  }
}
