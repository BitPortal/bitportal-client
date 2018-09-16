import React, { Component, Fragment } from 'react'
import { Text, View, TouchableOpacity, TouchableWithoutFeedback, ActivityIndicator, ScrollView } from 'react-native'
import Colors from 'resources/colors'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { connect } from 'react-redux'
import { FormattedMessage, /* FormattedNumber, */IntlProvider } from 'react-intl'
import Modal from 'react-native-modal'
import { messageTypeSelector, messageInfoSelector } from 'selectors/dappBrowser'
import { noop } from 'utils'
import styles from './styles'
import messages from './messages'

const TransferActionItems = ({ info }) => (
  <Fragment>
    <View style={styles.item}>
      <Text style={styles.label}>操作:</Text>
      <Text style={styles.data}>
        Payment
      </Text>
    </View>
    <View style={styles.item}>
      <Text style={styles.label}>合约:</Text>
      <Text style={styles.data}>
        {info.get('contract')}
      </Text>
    </View>
    <View style={styles.item}>
      <Text style={styles.label}>数量:</Text>
      <Text style={styles.data}>
        {info.get('amount')} {info.get('symbol')}
      </Text>
    </View>
    <View style={styles.item}>
      <Text style={styles.label}>支付帐户:</Text>
      <Text style={styles.data}>
        {info.get('fromAccount')}
      </Text>
    </View>
    <View style={styles.item}>
      <Text style={styles.label}>接收帐户:</Text>
      <Text style={styles.data}>
        {info.get('toAccount')}
      </Text>
    </View>
    <View style={styles.item}>
      <Text style={styles.label}>附言:</Text>
      <Text style={styles.data}>
        {info.get('memo')}
      </Text>
    </View>
  </Fragment>
)

const VoteActionItems = ({ info }) => (
  <Fragment>
    <View style={styles.item}>
      <Text style={styles.label}>操作:</Text>
      <Text style={styles.data}>
        投票
      </Text>
    </View>
    <View style={styles.item}>
      <Text style={styles.label}>投票者:</Text>
      <Text style={styles.data}>
        {info.get('voter')}
      </Text>
    </View>
    <View style={styles.item}>
      <Text style={styles.label}>已选节点:</Text>
      <ScrollView style={styles.dataView}>
        {info.get('producers').map(producer => <Text key={producer} style={styles.data}>{producer}</Text>)}
      </ScrollView>
    </View>
  </Fragment>
)

const SignActionItems = ({ info }) => (
  <Fragment>
    <View style={styles.item}>
      <Text style={styles.label}>操作:</Text>
      <Text style={styles.data}>
        签名
      </Text>
    </View>
    <View style={styles.item}>
      <Text style={styles.label}>签名者:</Text>
      <Text style={styles.data}>
        {info.get('account')}
      </Text>
    </View>
    <View style={styles.item}>
      <Text style={styles.label}>公钥:</Text>
      <Text style={styles.data}>
        {info.get('publicKey')}
      </Text>
    </View>
    <View style={styles.item}>
      <Text style={styles.label}>签名内容:</Text>
      <Text style={styles.data}>
        {info.get('signData')}
      </Text>
    </View>
  </Fragment>
)

const PushActionItems = ({ info }) => (
  <Fragment>
    <View style={styles.item}>
      <Text style={styles.label}>操作:</Text>
      <Text style={styles.data}>
        执行EOS合约
      </Text>
    </View>
    <View style={styles.item}>
      <Text style={styles.label}>详情:</Text>
      <ScrollView style={styles.dataView}>
        {info.get('actions').map(action => (
          <View key={`${action.get('account')}-${action.get('name')}`} style={styles.dataViewAction}>
            <Text style={styles.data}>
              <Text>帐户</Text>
              <Text style={styles.highlight}>{action.getIn(['authorization', 0, 'actor'])}</Text>
              <Text>使用</Text>
              <Text style={styles.highlight}>{action.getIn(['authorization', 0, 'permission'])}</Text>
              <Text>权限执行</Text>
              <Text style={styles.highlight}>{action.get('account')}</Text>
              <Text>合约的</Text>
              <Text style={styles.highlight}>{action.get('name')}</Text>
              <Text>操作, 参数列表:</Text>
            </Text>
            <View style={styles.actionData}>
              {action.get('data').entrySeq().map(item => (
                <View key={item[0]} style={styles.actionDataItem}>
                  <Text style={styles.actionDataLabel}>{item[0]}: </Text>
                  <Text style={styles.actionDataValue}>{item[1]}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  </Fragment>
)

@connect(
  state => ({
    locale: state.intl.get('locale'),
    dappBrowser: state.dappBrowser,
    messageType: messageTypeSelector(state),
    messageInfo: messageInfoSelector(state)
  })
)

export default class ActionModal extends Component {
  renderItems = (messageType, info) => {
    if (messageType === 'eosAuthSign') {
      return (<SignActionItems info={info} />)
    } else if (messageType === 'transferEOSAsset') {
      return (<TransferActionItems info={info} />)
    } else if (messageType === 'voteEOSProducers') {
      return (<VoteActionItems info={info} />)
    } else if (messageType === 'pushEOSAction') {
      return (<PushActionItems info={info} />)
    }

    return null
  }

  render() {
    const {
      isVisible,
      dismiss,
      confirm,
      locale,
      loading,
      messageType,
      messageInfo
    } = this.props

    return (
      <Modal
        animationIn="slideInUp"
        animationOut="slideOutDown"
        style={{ margin: 0 }}
        isVisible={isVisible}
        backdropOpacity={0.9}
      >
        <IntlProvider messages={messages[locale]}>
          <View style={styles.mask}>
            <TouchableWithoutFeedback onPress={dismiss}>
              <View style={styles.outside} />
            </TouchableWithoutFeedback>
            <View style={styles.content}>
              <View style={styles.header} onPress={() => {}}>
                <TouchableOpacity onPress={dismiss} style={styles.close}>
                  <Ionicons name="ios-close" size={28} color={Colors.bgColor_FFFFFF} />
                </TouchableOpacity>
                <Text style={styles.title}>交易详情</Text>
              </View>
              <View style={styles.body}>
                {this.renderItems(messageType, messageInfo)}
                <View style={[styles.item, styles.buttonItem]}>
                  <TouchableOpacity
                    onPress={!loading ? confirm : noop}
                    disabled={loading}
                    underlayColor={Colors.textColor_89_185_226}
                    style={styles.submitButton}
                  >
                    <Text style={styles.submitButtonText}>
                      <FormattedMessage id="send_confirm_button_confirm" />
                    </Text>
                    {loading && <ActivityIndicator style={styles.indicator} size="small" color="white" />}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </IntlProvider>
      </Modal>
    )
  }
}
