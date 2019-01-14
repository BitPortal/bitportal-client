import React, { Component } from 'react'
import Colors from 'resources/colors'
import { Navigation } from 'react-native-navigation'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { View, Text, TouchableOpacity, InteractionManager } from 'react-native'
import { connect } from 'react-redux'
import { IntlProvider, FormattedMessage } from 'react-intl'
import { bindActionCreators } from 'redux'
import { SwipeListView } from 'react-native-swipe-list-view'
import * as eosNodeActions from 'actions/eosNode'
import Prompt from 'components/Prompt'
import Alert from 'components/Alert'
import { validateUrl } from 'utils/validate'
import {
  eosNodesSelector,
  activeNodeSelector,
  defaultNodesSelector,
  customNodesSelector
} from 'selectors/eosNode'
import messages from 'resources/messages'
import { SwipeItem } from './NodeItem'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.locale,
    eosNodes: eosNodesSelector(state),
    activeNode: activeNodeSelector(state),
    defaultNodes: defaultNodesSelector(state),
    customNodes: customNodesSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...eosNodeActions
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
    isVisible: false,
    alertMessage: null
  }

  openPrompt = () => {
    this.setState({ isVisible: true })
  }

  closePrompt = () => {
    this.setState({ isVisible: false })
  }

  closeAlert = () => {
    this.setState({ alertMessage: null })
  }

  handleConfirm = (text) => {
    const { eosNodes } = this.props

    this.setState({ isVisible: false }, () => {
      InteractionManager.runAfterInteractions(() => {
        if (!validateUrl(text)) {
          this.setState({ alertMessage: messages[this.props.locale].settings_node_error_popup_text_node_invalid })
        } else if (eosNodes.findIndex(item => item.get('url') === text) !== -1) {
          this.setState({ alertMessage: messages[this.props.locale].settings_node_error_popup_text_node_exist })
        } else if (text) {
          this.props.actions.addCustomNode({ url: text })
        }
      })
    })
  }

  deleteCustomNode = (rowData) => {
    this.props.actions.deleteCustomNode(rowData.item.id)
  }

  setActiveNode = (rowData) => {
    this.props.actions.setActiveNode(rowData.item.url)
  }

  goBack = () => {
    Navigation.pop(this.props.componentId)
  }

  renderItem = (rowData) => {
    const { activeNode, customNodes } = this.props

    return (
      <SwipeItem
        data={rowData}
        onPress={this.setActiveNode}
        active={rowData.item.url === activeNode}
        deleteItem={this.deleteCustomNode.bind(this, rowData)}
        enableDelete={customNodes.findIndex(item => item.get('url') === rowData.item.url) !== -1}
      />
    )
  }

  renderSectionHeader = ({ section: { title, data } }) => (data.length > 0 ? (
    <View style={styles.headTitle}><Text style={styles.text14}>{title}</Text></View>
  ) : null)

  render() {
    const { locale, defaultNodes, customNodes } = this.props

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale].settings_button_node}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={this.goBack} />}
          />
          <View style={styles.scrollContainer}>
            <SwipeListView
              useSectionList
              enableEmptySections={true}
              showsVerticalScrollIndicator={false}
              sections={[
                { title: messages[locale].settings_node_label_default_node, data: defaultNodes.toJS() },
                { title: messages[locale].settings_node_label_customized_node, data: customNodes.toJS() }
              ]}
              renderItem={this.renderItem}
              renderSectionHeader={this.renderSectionHeader}
              keyExtractor={item => String(item.id)}
            />
          </View>
          <View style={[styles.btnContainer, styles.center]}>
            <TouchableOpacity style={[styles.center, styles.btn]} onPress={this.openPrompt}>
              <Text style={[styles.text14, { color: Colors.textColor_255_255_238 }]}>
                <FormattedMessage id="settings_node_button_add_node" />
              </Text>
            </TouchableOpacity>
          </View>
          <Alert message={this.state.alertMessage} dismiss={this.closeAlert} />
          <Prompt
            isVisible={this.state.isVisible}
            title={messages[locale].settings_node_popup_label_node}
            negativeText={messages[locale].settings_node_popup_button_cancel}
            positiveText={messages[locale].settings_node_popup_button_confirm}
            callback={this.handleConfirm}
            dismiss={this.closePrompt}
            type="plain-text"
          />
        </View>
      </IntlProvider>
    )
  }
}
