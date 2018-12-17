import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { Navigation } from 'react-native-navigation'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { Text, View, TouchableWithoutFeedback, Switch, ScrollView, LayoutAnimation } from 'react-native'
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view'
import Colors from 'resources/colors'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import { eosAccountSelector } from 'selectors/eosAccount'
import * as whiteListActions from 'actions/whiteList'
import messages from 'resources/messages'
import { BPImage } from 'components/BPNativeComponents'
import Images from 'resources/images'
import DeleteButton from './DeleteButton'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale'),
    eosAccount: eosAccountSelector(state),
    dappList: state.whiteList.get('dappList')
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...whiteListActions,
    }, dispatch)
  }),
  null,
  { withRef: true }
)

export default class WhiteListDetails extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  UNSAFE_componentWillUpdate() {
    LayoutAnimation.easeInEaseOut()
  }

  goBack = () => {
    Navigation.pop(this.props.componentId)
  }

  deleteContract = (rowData) => {
    this.props.actions.deleteContract({ item: rowData.item })
  }

  onValueChange = (value, item) => {
    this.props.actions.resetSettingEnabled({ value, item })
  }

  componentWillMount() {
    this.props.actions.getDappListStoreInfo()
  }

  renderItem = (rowData, rowMap) => (
    <SwipeRow
      disableRightSwipe={true}
      rightOpenValue={-100}
      previewOpenValue={-100}
      preview={true}
      style={{ backgroundColor: Colors.bgColor_30_31_37 }}
    >
      <DeleteButton onPress={this.deleteContract.bind(this, rowData, rowMap)} />
      <TouchableWithoutFeedback style={styles.listItem}>
        <View style={[styles.listItem, styles.extraListItem]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <BPImage source={rowData.item.iconUrl ? { uri: rowData.item.iconUrl } : Images.dapp_logo_default} style={styles.image} />
            <View style={{ width: '60%' }}>
              <Text style={styles.text16}>{rowData.item.dappName}</Text>
              <Text numberOfLines={1} style={styles.text14}>{rowData.item.dappUrl}</Text>
            </View>
          </View>
          <Switch
            style={styles.switch}
            value={rowData.item.settingEnabled}
            onValueChange={(value) => this.onValueChange(value, rowData.item)} 
          />
        </View>
      </TouchableWithoutFeedback>
    </SwipeRow>
  )

  renderHeader = () => (
    <View style={styles.header}>
      <Text style={[styles.text14, { color: Colors.textColor_255_255_238 }]}>
        白名单列表
      </Text>
      <Text style={[styles.text14, { color: Colors.textColor_255_255_238 }]}>
        高级设置
      </Text>
    </View>
  )

  render() {
    const { locale, dappList, eosAccountName } = this.props
    const newDappList = dappList.size ? dappList.filter((v) => v.get('accountName') === eosAccountName) : dappList
    // console.log('###--yy', dappList, eosAccountName, newDappList)
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title='白名单详情'
            leftButton={<CommonButton iconName="md-arrow-back" onPress={this.goBack} />}
          />
          <View style={styles.scrollContainer}>
          {
            newDappList.size ? 
              <SwipeListView
                useFlatList
                contentContainerStyle={{ paddingTop: 10 }}
                enableEmptySections={true}
                showsVerticalScrollIndicator={false}
                data={newDappList.toJS()}
                renderItem={this.renderItem}
                ListHeaderComponent={this.renderHeader}
                keyExtractor={item => String(item.dappName)}
              />
              :
              <ScrollView contentContainerStyle={{ paddingTop: 20 }}>
                <Text style={styles.text14}>
                  暂无白名单授权列表
                </Text>
              </ScrollView>
          }
          </View>
        </View>
      </IntlProvider>
    )
  }
}
