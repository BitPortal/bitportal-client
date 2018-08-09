import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { Text, View, Image, ScrollView, TouchableOpacity, TouchableHighlight, InteractionManager } from 'react-native'
import Colors from 'resources/colors'
import images from 'resources/images'
import Prompt from 'components/Prompt'
import LinearGradientContainer from 'components/LinearGradientContainer'
import messages from './messages'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale')
  }),
  null,
  null,
  { withRef: true }
)

export default class Backup extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  state = {
    isVisible: false
  }

  closePrompt = () => {
    this.setState({ isVisible: false })
  }

  handleConfirm = () => {
    this.setState({ isVisible: false }, () => {
      InteractionManager.runAfterInteractions(() => {
        // export action ...
      })
    })
  }

  goToBackup = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.ExportPrivateKey',
        passProps: {
          entry: 'Backup'
        }
      }
    })
  }

  skip = () => {
    Navigation.popToRoot(this.props.componentId)
  }

  render() {
    const { locale } = this.props
    return (
      <View style={styles.container}>
        <NavigationBar
          leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
          title={messages[locale].bcup_sec_title_nav}
        />
        <View style={styles.scrollContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={[styles.content, { alignItems: 'center' }]}>
              <View style={{ marginVertical: 20 }}>
                <Image source={images.backup_group} style={styles.image} />
              </View>
              <Text style={styles.text14}>
                {messages[locale].bcup_sec_title_backup}
              </Text>
              <View style={{ marginTop: 20 }}>
                <Text style={[styles.text14, { color: Colors.textColor_181_181_181 }]}>
                  {messages[locale].bcup_sec_tips_backup}
                </Text>
              </View>
              <TouchableHighlight
                onPress={() => this.setState({ isVisible: true })}
                underlayColor={Colors.textColor_89_185_226}
                style={[styles.btn, styles.center, { marginTop: 25, backgroundColor: Colors.textColor_89_185_226 }]}
              >
                <LinearGradientContainer type="right" style={[[styles.btn, styles.center]]}>
                  <Text style={styles.text14}>
                    {messages[locale].bcup_sec_title_nav}
                  </Text>
                </LinearGradientContainer>
              </TouchableHighlight>
              <TouchableOpacity
                onPress={() => this.skip()}
                style={[styles.btn, styles.center, { marginTop: 10 }]}
              >
                <Text style={[styles.text14, { color: Colors.textColor_89_185_226 }]}>
                  {messages[locale].bcup_button_title_skip}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          <Prompt
            isVisible={this.state.isVisible}
            type="secure-text"
            callback={this.handleConfirm}
            dismiss={this.closePrompt}
          />
        </View>
      </View>
    )
  }
}
