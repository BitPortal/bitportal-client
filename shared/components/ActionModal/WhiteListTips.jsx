import React, { PureComponent } from 'react'
import { TouchableOpacity, View, Text, ScrollView, Switch, LayoutAnimation } from 'react-native'
import Colors from 'resources/colors'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as whiteListActions from 'actions/whiteList'
import { whiteListAuthorizedSelector } from 'selectors/whiteList'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale'),
    value: state.whiteList.get('value'),
    authorized: whiteListAuthorizedSelector(state),
    selectedDapp: state.whiteList.get('selectedDapp')
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...whiteListActions
    }, dispatch)
  }),
  null,
  { withRef: true }
)

export default class WhiteListTips extends PureComponent {

  UNSAFE_componentWillUpdate() {
    LayoutAnimation.easeInEaseOut()
  }

  switchWhiteList = () => {
    const accept = this.props.selectedDapp.get('accept')
    this.props.actions.changeSwitchWhiteList({ accept: !accept })
  }

  switchSetting = () => {
    const accept = this.props.selectedDapp.get('accept')
    if (!accept) return
    const settingDisplay = this.props.selectedDapp.get('settingDisplay')
    this.props.actions.changeSwitchSetting({ settingDisplay: !settingDisplay })
  }

  onValueChange = (value) => {
    this.props.actions.changeSettingEnabled({ settingEnabled: value })
  }

  render() {
    const { value, selectedDapp, authorized } = this.props
    const accept = selectedDapp.get('accept')
    const settingDisplay = selectedDapp.get('settingDisplay')
    const settingEnabled = selectedDapp.get('settingEnabled')
    const signedColor = accept && { color: Colors.textColor_89_185_226 }
    const arrowColor = !accept ? Colors.textColor_107_107_107 : Colors.textColor_89_185_226
    if (!value) return null
    
    return (
      <ScrollView style={styles.whiteListView}>
        <View style={styles.whiteListContainer}>

          <View style={styles.titleContainer}>
            <Text style={styles.text15}> 
            {(authorized && accept) ? ' ' : '开启白名单'} 
            </Text>
            <View style={styles.titleSetting}>
              <Text onPress={this.switchSetting} style={[styles.text14, { marginTop: -4 }, signedColor]}> 
                高级设置 
              </Text>
              <Ionicons name={settingDisplay ? 'md-arrow-dropdown' : "md-arrow-dropright"} size={18} color={arrowColor} />
            </View>
          </View>

          {
            settingDisplay && accept &&
            <View style={styles.settingContainer}>
              <View style={styles.textSettingDes}>
                <Text style={[styles.text12, { marginRight: 10 }]}> 注意：</Text>
                <Text style={styles.text12}> 打开高级设置，下次进行该操作时，无需进行弹框确认直接执行，开启后可前往钱包管理中关闭 </Text>
              </View>
              <View style={styles.switchContainer}>
                <Switch
                  style={styles.switch}
                  value={settingEnabled}
                  onValueChange={this.onValueChange} 
                />
              </View>
            </View>
          }

          {
            !(authorized && accept) &&
            <View style={styles.contentContainer}>
              <TouchableOpacity onPress={this.switchWhiteList} style={styles.btn}>
                <Text style={styles.text12}> 同意 </Text>
              </TouchableOpacity>
              <View style={styles.textContentDes}>
                <Text style={styles.text12}> 
                  您可以将此操作列入白名单，下次就不必在此授权。勾选属性旁边的单选按钮意味着您允许此操作的该属性可以更改，仅当其他属性发生变化才不会被列入白名单。 
                </Text>
              </View>
            </View>
          }

        </View>
      </ScrollView>
    )
  }
}
