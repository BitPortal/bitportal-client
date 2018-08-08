import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { Text, View, ScrollView, TouchableOpacity, TouchableHighlight } from 'react-native'
import Colors from 'resources/colors'
import Ionicons from 'react-native-vector-icons/Ionicons'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale')
  }),
  null,
  null,
  { withRef: true }
)

export default class BackupTips extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  goToBackup = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.Backup'
      }
    })
  }

  goToTutorials = () => {

  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar
          leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
          title="Backup"
        />
        <View style={styles.scrollContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={[styles.content, { alignItems: 'center' }]}>
              <View style={{ marginVertical: 20 }}>
                <Ionicons name="ios-checkmark-circle" size={100} color={Colors.textColor_89_185_226} />
              </View>
              <Text style={styles.text14}>The final step: </Text>
              <Text style={styles.text14}>Back up your account now!</Text>
              <View style={{ marginTop: 20 }}>
                <Text style={[styles.text14, { color: Colors.textColor_181_181_181 }]}>
                  Backup account: Export mnemonics and copy it to a safe place, never save it on the web. Then try to transfer and transfer the small assets to start using.
                </Text>
              </View>
              <TouchableHighlight
                onPress={() => this.goToBackup()}
                underlayColor={Colors.textColor_89_185_226}
                style={[styles.btn, styles.center, { marginTop: 25, backgroundColor: Colors.textColor_89_185_226 }]}
              >
                <Text style={styles.text14}>
                  Backup
                </Text>
              </TouchableHighlight>
              <TouchableOpacity
                onPress={() => this.goToTutorials()}
                style={[styles.btn, styles.center, { marginTop: 15 }]}
              >
                <Text style={[styles.text14, { color: Colors.textColor_89_185_226 }]}>
                  View Backup Detailed Tutorials
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    )
  }
}
