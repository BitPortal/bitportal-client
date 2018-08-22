import React, { Component } from 'react'
import Colors from 'resources/colors'
import NavigationBar, { CommonButton, CommonRightButton } from 'components/NavigationBar'
import { Text, View, Switch, Image, VirtualizedList } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import * as eosAssetActions from 'actions/eosAsset'
import { eosAssetListSelector } from 'selectors/eosAsset'
import Images from 'resources/images'
import messages from './messages'
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
    this.props.actions.toggleEOSAsset(contract)
  }

  onRefresh = () => this.props.actions.getEOSAssetRequested()

  renderItem = ({ item }) => (
    <AssetElement item={item} onToggle={() => this.onToggle(item)} />
  )

  render() {
    const { locale, eosAssetList, loading, loaded } = this.props

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale].astlist_title_name_astlst}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
          />
          <View style={styles.scrollContainer}>
            <VirtualizedList
              data={eosAssetList}
              refreshing={loading && !loaded}
              onRefresh={this.onRefresh}
              getItem={(items, index) => (items.get ? items.get(index) : items[index])}
              getItemCount={items => (items.size || 0)}
              keyExtractor={item => String(item.get('account'))}
              renderItem={this.renderItem}
            />
          </View>
        </View>
      </IntlProvider>
    )
  }
}
