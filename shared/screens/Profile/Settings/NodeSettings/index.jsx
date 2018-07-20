

import React, { Component } from 'react'
import Colors from 'resources/colors'
import { Navigation } from 'react-native-navigation'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { View, Text, ListView, Platform, TouchableOpacity, InteractionManager, LayoutAnimation } from 'react-native'
import { connect } from 'react-redux'
import { IntlProvider, FormattedMessage } from 'react-intl'
import { bindActionCreators } from 'redux'
import { NODES } from 'constants/nodeSettings'
import { SwipeListView } from 'react-native-swipe-list-view'
import { FontScale } from 'utils/dimens'
import storage from 'utils/storage'
import Dialog from 'components/Dialog'
import DialogAndroid from 'components/DialogAndroid'
import { validateUrl } from 'utils/validate'
import _ from 'lodash'
import { DefaultItem, SwipeItem } from './NodeItem'
import messages from './messages'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale')
  }),
  dispatch => ({
    actions: bindActionCreators({

    }, dispatch)
  }),
  null,
  { withRef: true }
)

export default class NodeSettings extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  state = {
    CUSTOM_NODES: [],
    activeNode: NODES[0],
    isVisible: false,
    customNode: ''
  }

  constructor(props, context) {
    super(props, context)
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
  }

  async componentWillMount() {
    const store1 = await storage.getItem('bitportal.customNodes', true)
    if (store1 && store1.customNodes && store1.customNodes.length > 0) {
      const customNodes = [].concat(store1.customNodes)
      this.setState({ CUSTOM_NODES: customNodes })
    }
    const store2 = await storage.getItem('bitportal.activeNode', true)
    if (store2 && store2.activeNode) {
      this.setState({ activeNode: store2.activeNode })
    }
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut()
  }

  // 激活并保存选中节点
  saveNode = async () => {
    await storage.mergeItem('bitportal.activeNode', { activeNode: this.state.activeNode }, true)
    Dialog.alert(messages[this.props.locale].ndst_button_name_saved)
  }

  // 弹出添加弹框
  addCustomNodes = async () => {
    const { locale } = this.props
    if (Platform.OS === 'android') {
      this.setState({ isVisible: true })
    } else {
      const { action, text } = await Dialog.prompt(
        messages[locale].ndst_title_popup_addNode,
        null,
        {
          positiveText: messages[locale].ndst_setting_popup_ent,
          negativeText: messages[locale].ndst_setting_popup_can,
          disableSecureText: 'plain-text'
        }
      )
      if (action === Dialog.actionPositive) return this.saveCustomNodes(text)
    }
  }

  // only android 前往保存
  handleConfirm = () => {
    this.saveCustomNodes(this.state.customNode)
  }

  // 删除自定义节点
  deleteCustomNodes = (rowData, secId, rowId) => {
    const { CUSTOM_NODES } = this.state
    CUSTOM_NODES.splice(rowId, 1)
    storage.mergeItem('bitportal.customNodes', { customNodes: CUSTOM_NODES }, true)
    this.setState({ CUSTOM_NODES })
  }

  // 保存自定义节点
  saveCustomNodes = (customNode) => {
    this.setState({ isVisible: false }, () => {
      InteractionManager.runAfterInteractions(() => {
        const isVaild = this.validateCustomeNode(customNode)
        if (customNode && isVaild) {
          this.state.CUSTOM_NODES.push(customNode)
          storage.mergeItem('bitportal.customNodes', { customNodes: this.state.CUSTOM_NODES }, true)
          this.setState(prevState => ({ CUSTOM_NODES: prevState.CUSTOM_NODES }))
        }
      })
    })
  }

  // 切换节点
  switchNode = (activeNode) => {
    this.setState({ activeNode })
  }

  // 检测节点有效性
  validateCustomeNode = (customNode) => {
    if (!validateUrl(customNode)) {
      Dialog.alert(messages[this.props.locale].ndst_button_name_errnd)
      return false
    }
    const index = _.findIndex(this.state.CUSTOM_NODES.concat(NODES), node => node === customNode)
    if (index !== -1) {
      Dialog.alert(messages[this.props.locale].ndst_button_name_dplnd)
      return false
    }
    return true
  }

  renderRow(rowData, secId, rowId, rowMap) {
    const { activeNode, CUSTOM_NODES } = this.state
    if (CUSTOM_NODES.length > 0) {
      return (
        <SwipeItem
          item={rowData}
          onPress={() => this.switchNode(rowData)}
          active={rowData === activeNode}
          deleteItem={() => this.deleteCustomNodes(rowData, secId, rowId, rowMap)}
        />
      )
    } else {
      return <Text style={[styles.text14, { marginTop: 20, alignSelf: 'center' }]}> 未添加自定义节点 </Text>
    }
  }

  renderHeader() {
    const { activeNode, CUSTOM_NODES } = this.state
    return (
      <View>
        <View style={styles.headTitle}><Text style={styles.text14}> 默认节点 </Text></View>
        {
          NODES.map((item, index) => <DefaultItem key={index} item={item} active={activeNode === item} onPress={this.switchNode} />)
        }
        {CUSTOM_NODES.length > 0 && <View style={styles.headTitle}><Text style={styles.text14}> 自定义节点 </Text></View>}
      </View>
    )
  }

  render() {
    const { locale } = this.props
    const { CUSTOM_NODES } = this.state
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale].ndst_title_name_nodesettings}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
            rightButton={<CommonButton title={messages[locale].ndst_button_name_save} onPress={this.saveNode} extraTextStyle={{ fontSize: FontScale(18), color: Colors.textColor_89_185_226 }} />}
          />
          <View style={styles.scrollContainer}>
            <SwipeListView
              enableEmptySections={true}
              showsVerticalScrollIndicator={false}
              dataSource={this.ds.cloneWithRows(CUSTOM_NODES)}
              renderRow={this.renderRow.bind(this)}
              renderHeader={this.renderHeader.bind(this)}
            />
          </View>
          <View style={[styles.btnContainer, styles.center]}>
            <TouchableOpacity style={[styles.center, styles.btn]} onPress={this.addCustomNodes}>
              <Text style={[styles.text14, { color: Colors.textColor_255_255_238 }]}>
                <FormattedMessage id="ndst_button_name_add" />
              </Text>
            </TouchableOpacity>
          </View>
          {
            Platform.OS === 'android'
            && <DialogAndroid
              tilte={messages[locale].ndst_title_popup_addNode}
              content=""
              disableSecureText={true}
              positiveText={messages[locale].ndst_setting_popup_ent}
              negativeText={messages[locale].ndst_setting_popup_can}
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
