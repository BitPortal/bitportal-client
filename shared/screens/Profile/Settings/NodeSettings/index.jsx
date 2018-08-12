import React, { Component } from 'react'
import Colors from 'resources/colors'
import { Navigation } from 'react-native-navigation'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { View, Text, ListView, TouchableOpacity, InteractionManager } from 'react-native'
import { connect } from 'react-redux'
import { IntlProvider, FormattedMessage } from 'react-intl'
import { bindActionCreators } from 'redux'
import { EOS_NODES } from 'constants/chain'
import { SwipeListView } from 'react-native-swipe-list-view'
import { FontScale } from 'utils/dimens'
import storage from 'utils/storage'
import Prompt from 'components/Prompt'
import Alert from 'components/Alert'
import { validateUrl } from 'utils/validate'
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
    activeNode: EOS_NODES[0],
    isVisible: false,
    alertMessage: null
  }

  constructor(props, context) {
    super(props, context)
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
  }

  // 激活并保存选中节点
  saveNode = async () => {
    await storage.mergeItem('bitportal.activeNode', { activeNode: this.state.activeNode }, true)
    this.setState({ alertMessage: messages[this.props.locale].ndst_button_name_saved })
  }

  // 弹出添加弹框
  addCustomNodes = () => {
    this.setState({ isVisible: true })
  }

  closePrompt = () => {
    this.setState({ isVisible: false })
  }

  closeAlert = () => {
    this.setState({ alertMessage: null })
  }

  // only android 前往保存
  handleConfirm = (text) => {
    this.setState({ isVisible: false }, () => {
      InteractionManager.runAfterInteractions(() => {
        if (!validateUrl(text)) {
          this.setState({ alertMessage: messages[this.props.locale].ndst_button_name_errnd })
        } else if (this.state.CUSTOM_NODES.concat(EOS_NODES).filter(node => node === text).length) {
          this.setState({ alertMessage: messages[this.props.locale].ndst_button_name_dplnd })
        } else if (text) {
          this.state.CUSTOM_NODES.push(text)
          storage.mergeItem('bitportal.customNodes', { customNodes: this.state.CUSTOM_NODES }, true)
          this.setState(prevState => ({ CUSTOM_NODES: prevState.CUSTOM_NODES }))
        }
      })
    })
  }

  // 删除自定义节点
  deleteCustomNodes = (rowData, secId, rowId) => {
    const { CUSTOM_NODES } = this.state
    CUSTOM_NODES.splice(rowId, 1)
    storage.mergeItem('bitportal.customNodes', { customNodes: CUSTOM_NODES }, true)
    this.setState({ CUSTOM_NODES })
  }

  // 切换节点
  switchNode = (activeNode) => {
    this.setState({ activeNode })
  }

  renderRow = (rowData, secId, rowId, rowMap) => {
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
      return <Text style={[styles.text14, { marginTop: 20, alignSelf: 'center' }]}>未添加自定义节点</Text>
    }
  }

  renderHeader = () => {
    const { activeNode, CUSTOM_NODES } = this.state

    return (
      <View>
        <View style={styles.headTitle}><Text style={styles.text14}>默认节点</Text></View>
        {EOS_NODES.map((item, index) => <DefaultItem key={index} item={item} active={activeNode === item} onPress={this.switchNode} />)}
        {CUSTOM_NODES.length > 0 && <View style={styles.headTitle}><Text style={styles.text14}>自定义节点</Text></View>}
      </View>
    )
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
              renderRow={this.renderRow}
              renderHeader={this.renderHeader}
            />
          </View>
          <View style={[styles.btnContainer, styles.center]}>
            <TouchableOpacity style={[styles.center, styles.btn]} onPress={this.addCustomNodes}>
              <Text style={[styles.text14, { color: Colors.textColor_255_255_238 }]}>
                <FormattedMessage id="ndst_button_name_add" />
              </Text>
            </TouchableOpacity>
          </View>
          <Alert message={this.state.alertMessage} dismiss={this.closeAlert} />
          <Prompt
            isVisible={this.state.isVisible}
            title={messages[locale].ndst_title_popup_addNode}
            negativeText={messages[locale].ndst_setting_popup_can}
            positiveText={messages[locale].ndst_setting_popup_ent}
            callback={this.handleConfirm}
            dismiss={this.closePrompt}
            type="plain-text"
          />
        </View>
      </IntlProvider>
    )
  }
}
