/* @tsx */

import React from 'react'
import BaseScreen from 'components/BaseScreen'
import Colors from 'resources/colors'
import SettingItem from 'components/SettingItem'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { View, Text, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import { bindActionCreators } from 'redux'
import { NODES } from 'constants/nodeSettings'
import { DefaultItem, CustomItem } from './NodeItem'
import Dialog from 'components/Dialog'
import messages from './messages'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale')
  }),
  dispatch => ({
    actions: bindActionCreators({
      
    }, dispatch)
  })
)

export default class NodeSettings extends BaseScreen {

  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  state = {
    activeNode: NODES[0]
  }

  switchNode = (activeNode) => {
    this.setState({ activeNode })
  }

  render() {
    const { locale, currency } = this.props
    const { activeNode } = this.state
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale]["ndst_title_name_nodesettings"]}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => this.pop()} />}
            rightButton={<CommonButton title={"保存"}  />}
          />
          <View style={styles.scrollContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.headTitle}>
                <Text style={styles.text14}> 默认设置 </Text>
              </View>
              {
                NODES.map((item, index) => <DefaultItem key={index} item={item} active={activeNode==item} onPress={this.switchNode} />)
              }
              <View style={styles.headTitle}>
                <Text style={styles.text14}> 自定义节点 </Text>
              </View>
              {
                NODES.map((item, index) => <DefaultItem key={index} />)
              }
            </ScrollView>
          </View>
        </View>
      </IntlProvider>
    )
  }
}
