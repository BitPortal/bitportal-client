import React, { Component } from 'react'
import Colors from 'resources/colors'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { Text, View, ScrollView, Switch } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import messages from './messages'
import styles from './styles'

const AssetElement = ({ item, onValueChange }) => (
  <View style={[styles.listContainer, styles.between, { paddingHorizontal: 32, backgroundColor: Colors.bgColor_30_31_37 }]}>
    <View style={{ flexDirection: 'row' }}>
      <Text style={styles.text20}> { item.assetName } </Text>
    </View>
    <Switch value={item.value} onValueChange={e => onValueChange(e, item)} />
  </View>
)

@connect(
  state => ({
    locale: state.intl.get('locale')
  }),
  null,
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
    assetsList: [
      { assetName: 'EOS', value: true },
      { assetName: 'UIP', value: false },
      { assetName: 'OCT', value: false },
      { assetName: 'PRA', value: false },
      { assetName: 'DEW', value: false },
      { assetName: 'EOS', value: true },
      { assetName: 'UIP', value: false },
      { assetName: 'OCT', value: false }
    ]
  }

  // 激活或隐藏钱包
  onValueChange = (value, item) => {
    item.value = value
    this.setState(prevState => ({ assetsList: prevState.assetsList }))
  }

  render() {
    const { locale } = this.props
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
            title={messages[locale].astlist_title_name_astlst}
          />
          <View style={styles.scrollContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {
                this.state.assetsList.map((item, index) => (
                  <AssetElement key={index} item={item} onValueChange={(e, item) => this.onValueChange(e, item)} />
                ))
              }
            </ScrollView>
          </View>
        </View>
      </IntlProvider>
    )
  }
}
