/* @tsx */

import React from 'react'
import BaseScreen from 'components/BaseScreen'
import Colors from 'resources/colors'
import SettingItem from 'components/SettingItem'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { View, Text, Platform, TouchableOpacity, InteractionManager, LayoutAnimation } from 'react-native'
import { connect } from 'react-redux'
import { IntlProvider, FormattedMessage } from 'react-intl'
import { bindActionCreators } from 'redux'
import { NODES } from 'constants/nodeSettings'
import { DefaultItem, SwipeItem } from './NodeItem'
import { SwipeListView } from 'react-native-swipe-list-view'
import { FontScale } from 'utils/dimens'
import storage from 'utils/storage'
import Dialog from 'components/Dialog'
import DialogAndroid from 'components/DialogAndroid'
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
    sectionListData: [
      { title: '默认节点', data: NODES },
      { title: '自定义节点', data: [] }
    ],
    activeNode: NODES[0],
    isVisible: false,
    customNode: ''
  }

  async componentWillMount() {
    const store1 = await storage.getItem('bitportal.customNodes', true)
    if (store1 && store1.customNodes && store1.customNodes.length > 0) {
      this.state.sectionListData[1].data = store1.saveCustomNodes
      this.setState({ sectionListData: this.state.sectionListData })
    }
    const store2 = await storage.getItem('bitportal.activeNode', true)
    if (store2 && store2.activeNode) {
      this.setState({ activeNode: store2.activeNode })
    }
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut()
  }

  saveNode = async () => {
    await storage.mergeItem('bitportal.activeNode', { activeNode: this.state.activeNode }, true)
    Dialog.alert('保存成功')
  }

  addCustomNodes = async () => {
    const { locale } = this.props
    if (Platform.OS == 'android') {
      this.setState({ isVisible: true })
    } else {
      const { action, text } = await Dialog.prompt(
        messages[locale]["ndst_title_popup_addNode"],
        null,
        {
          positiveText: messages[locale]["ndst_setting_popup_ent"],
          negativeText: messages[locale]["ndst_setting_popup_can"],
          disableSecureText: 'plain-text'
        }
      )
      if ( action == Dialog.actionPositive ) return this.saveCustomNodes(text)
    }
  }
  
  // only android 
  handleConfirm = () => {
    this.saveCustomNodes(this.state.customNode)
  }

  deleteCustomNodes = (nodeIndex) => {
    const { CUSTOM_NODES } = this.state
    CUSTOM_NODES.splice(nodeIndex, 1)
    storage.mergeItem('bitportal.customNodes', { customNodes: CUSTOM_NODES }, true)
    this.setState({ CUSTOM_NODES })
  }

  saveCustomNodes = (customNode) => {
    this.setState({ isVisible: false }, () => {
      InteractionManager.runAfterInteractions(() => {
        if (customNode) {
          this.state.CUSTOM_NODES.push(customNode)
          storage.mergeItem('bitportal.customNodes', { customNodes: this.state.CUSTOM_NODES }, true)
          this.setState({ CUSTOM_NODES: this.state.CUSTOM_NODES })
        }
      })
    })
  }

  switchNode = (activeNode) => {
    this.setState({ activeNode })
  }

  renderItem = (data, secId, rowId, rowMap) => {
    const { activeNode } = this.state
    if (secId == 0) {
      return (
        <DefaultItem key={rowId} item={data} active={activeNode==data} onPress={this.switchNode} />
      )
    } else {
      return (
        data.length > 0 ?
          <SwipeItem 
            key={secId} 
            item={data} 
            index={index}  
            active={activeNode==item} 
            onPress={this.switchNode} 
            deleteItem={this.deleteCustomNodes} 
          />
          :
          <Text style={[styles.text14, { marginTop: 20, alignSelf: 'center' }]}> 未添加自定义节点 </Text>
      )
    }
  }

  render() {
    const { locale, currency } = this.props
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale]["ndst_title_name_nodesettings"]}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => this.pop()} />}
            rightButton={<CommonButton title={"保存"} onPress={this.saveNode} extraTextStyle={{ fontSize: FontScale(18), color: Colors.textColor_89_185_226 }} />}
          />
          <View style={styles.scrollContainer}>
            <SwipeListView
              contentContainerStyle={{ paddingTop: 10 }}
              sections={this.state.sectionListData}
              showsVerticalScrollIndicator={false}
              renderItem={this.renderItem}
              renderSectionHeader={({ section }) => (
                <View style={styles.headTitle}><Text style={styles.text14}> {section.title} </Text></View>
              )}
            />
          </View>
          <View style={[styles.btnContainer, styles.center]}>
            <TouchableOpacity style={[styles.center, styles.btn]} onPress={this.addCustomNodes}>
              <Text style={[styles.text14, { color: Colors.textColor_255_255_238}]}> 
                <FormattedMessage id="ndst_button_name_add" /> 
              </Text>
            </TouchableOpacity>
          </View>
          {
            Platform.OS === 'android' &&
            <DialogAndroid
              tilte={messages[locale]["ndst_title_popup_addNode"]}
              content={''}
              disableSecureText={true}
              positiveText={messages[locale]["ndst_setting_popup_ent"]}
              negativeText={messages[locale]["ndst_setting_popup_can"]}
              onChange={customNode => this.setState({ customNode })}
              isVisible={this.state.isVisible}
              handleCancel={() => this.setState({ isVisible: false })}
              handleConfirm={this.handleConfirm}
            />
          }
        </View>
      </IntlProvider>
    )
  }
}
