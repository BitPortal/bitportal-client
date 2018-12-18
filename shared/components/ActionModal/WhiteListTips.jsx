import React, { PureComponent } from 'react'
import { TouchableOpacity, View, Text, ScrollView, Switch, LayoutAnimation } from 'react-native'
import Colors from 'resources/colors'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as whiteListActions from 'actions/whiteList'
import { whiteListAuthorizedSelector } from 'selectors/whiteList'
import BPImage from 'components/BPNativeComponents/BPImage'
import Images from 'resources/images'
import messges from 'resources/messages'
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
    const { value, selectedDapp, authorized, locale } = this.props
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
              {(authorized && accept) ? ' ' : messges[locale].transaction_detail_label_enable_whitelist} 
            </Text>
            <View style={styles.titleSetting}>
              <Text onPress={this.switchSetting} style={[styles.text14, { marginTop: -4 }, signedColor]}> 
                {messges[locale].transaction_detail_button_advanced_settings} 
              </Text>
              <Ionicons name={settingDisplay ? 'md-arrow-dropdown' : "md-arrow-dropright"} size={18} color={arrowColor} />
            </View>
          </View>

          {
            settingDisplay && accept &&
            <View style={styles.settingContainer}>
              <View style={styles.textSettingDes}>
                <BPImage source={Images.whiteList_warning} style={[styles.image, { marginRight: 10 }]} />
                <Text style={styles.text12}> 
                  {messges[locale].transaction_detail_text_enable_advanced_settings}
                </Text>
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
                { accept 
                  ? <BPImage source={Images.whiteList_accepted} style={styles.image} />
                  : <BPImage source={Images.whiteList_accept} style={styles.image} />
                }
              </TouchableOpacity>
              <View style={styles.textContentDes}>
                <Text style={styles.text12}> 
                  {messges[locale].transaction_detail_text_agree_whitelist} 
                </Text>
              </View>
            </View>
          }

        </View>
      </ScrollView>
    )
  }
}
