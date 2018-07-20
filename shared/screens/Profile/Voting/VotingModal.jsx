
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import Colors from 'resources/colors'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {
  FontScale,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  ifIphoneX
} from 'utils/dimens'
import { FormattedMessage, IntlProvider } from 'react-intl'
import Modal from 'react-native-modal'
import messages from './messages'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT
  },
  header: {
    width: SCREEN_WIDTH,
    height: 50,
    paddingHorizontal: 32,
    backgroundColor: Colors.mainThemeColor,
  },
  between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottom: {
    ...ifIphoneX({
      paddingBottom: 34
    }, {
      paddingBottom: 0
    })
  },
  close: {
    width: 50,
    height: 50,
    marginLeft: -20
  },
  text18: {
    fontSize: FontScale(18),
    color: Colors.textColor_255_255_238
  },
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_255_255_238
  },
  item: {
    width: SCREEN_WIDTH - 64,
    height: 30,
  },
  line: {
    width: SCREEN_WIDTH - 64,
    height: 1,
    backgroundColor: Colors.textColor_181_181_181,
    marginVertical: 15
  },
  location: {
    paddingHorizontal: 8,
    minWidth: 44,
    height: 20,
    backgroundColor: 'rgba(89,185,226,0.6)',
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.borderColor_89_185_226
  },
  btn: {
    width: SCREEN_WIDTH - 64,
    height: 40,
    borderRadius: 3,
    backgroundColor: Colors.textColor_89_185_226,
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center'
  },
  indicator: {
    marginLeft: 10
  },
  disabled: {
    backgroundColor: Colors.textColor_181_181_181
  }
})

@connect(
  state => ({
    locale: state.intl.get('locale')
  })
)

export default class VotingModal extends Component {
  render() {
    const { isVisible, dismissModal, selected, locale, onPress, isVoting } = this.props

    return (
      <Modal
        animationIn="slideInUp"
        animationOut="slideOutDown"
        style={{ margin: 0 }}
        isVisible={isVisible}
        backdropOpacity={0.9}
      >
        <IntlProvider messages={messages[locale]}>
          <View style={styles.container}>
            <TouchableOpacity onPress={() => dismissModal()} style={{ flex: 1 }} />
            <View style={[styles.header, styles.between]}>
              <TouchableOpacity onPress={() => dismissModal()} style={[styles.center, styles.close]}>
                <Ionicons name="ios-close" size={28} color={Colors.bgColor_FFFFFF} />
              </TouchableOpacity>
              <Text style={styles.text18}> <FormattedMessage id="vt_btmsec_name_selected" /> </Text>
              <Text style={styles.text18} />
            </View>
            <View style={[styles.header, styles.bottom, { backgroundColor: Colors.minorThemeColor, minHeight: 300 }]}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {
                  selected.map((item, index) => (
                    <View key={item} style={[styles.item, { alignItems: 'center', flexDirection: 'row', marginTop: 10 }]}>
                      <Text style={[styles.text14, { minWidth: 20 }]}>{index + 1}</Text>
                      <View style={{ flexDirection: 'row', marginLeft: 25 }}>
                        {/* <View style={[styles.location, styles.center]}>
                            <Text style={ [styles.text14]}>
                            {item.get('location')}
                            </Text>
                            </View> */}
                        <Text style={[styles.text14, { marginLeft: 10 }]}>{item}</Text>
                      </View>
                    </View>
                  ))
                }
              </ScrollView>
              <TouchableOpacity
                onPress={onPress}
                underlayColor={Colors.textColor_89_185_226}
                style={[styles.btn, styles.center, !isVoting ? {} : styles.disabled]}
                disabled={isVoting}
              >
                <Text style={[styles.text18]}><FormattedMessage id="vt_button_name_vote" /></Text>
                {isVoting && <ActivityIndicator style={styles.indicator} size="small" color="white" />}
              </TouchableOpacity>
            </View>
          </View>
        </IntlProvider>
      </Modal>
    )
  }
}
