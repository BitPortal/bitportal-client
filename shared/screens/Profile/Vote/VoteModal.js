/* @jsx */
import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, TouchableHighlight, ScrollView } from 'react-native'
import Colors from 'resources/colors'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { 
  FontScale, 
  SCREEN_WIDTH, 
  SCREEN_HEIGHT, 
  NAV_BAR_HEIGHT, 
  TAB_BAR_HEIGHT,
  ifIphoneX 
} from 'utils/dimens'
import { connect } from 'react-redux'
import { FormattedMessage, FormattedNumber, IntlProvider } from 'react-intl'
import messages from './messages'
import Modal from 'react-native-modal'
import { voteProcuderSelector } from 'selectors/vote'

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
    },{
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
    width: SCREEN_WIDTH-64,
    height: 30,
  },
  line: {
    width: SCREEN_WIDTH-64,
    height: 1,
    backgroundColor: Colors.textColor_181_181_181,
    marginVertical: 15
  },
  location: {
    paddingHorizontal: 3,
    paddingHorizontal: 8,
    minWidth: 44,
    height: 20,
    backgroundColor: 'rgba(89,185,226,0.6)',
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.borderColor_89_185_226
  },
  btn: {
    width: SCREEN_WIDTH-64,
    height: 40,
    borderRadius: 3,
    backgroundColor: Colors.textColor_89_185_226,
    marginTop: 20,
    marginBottom: 20
  }
})

@connect(
  (state) => ({
    locale: state.intl.get('locale'),
    vote: voteProcuderSelector(state)
  })
)

export default class VoteModal extends Component {

  render() {
    const { isVisible, dismissModal, vote, locale, onPress } = this.props
    return (
      <Modal
        animationIn="slideInUp"
        animationOut="slideOutDown"
        style = {{  margin: 0 }}
        isVisible={isVisible}
        backdropOpacity={0.9}
      >
       <IntlProvider messages={messages[locale]}>
          <View style={styles.container}>
            <TouchableOpacity onPress={() => dismissModal()} style={{ flex: 1 }} />
            <View style={[styles.header, styles.between]}>
              <TouchableOpacity onPress={() => dismissModal()} style={[styles.center, styles.close]} >
                <Ionicons name="ios-close" size={28} color={Colors.bgColor_FFFFFF} />
              </TouchableOpacity>
              <Text style={styles.text18}> Selected </Text>
              <Text style={styles.text18}> {' '} </Text>
            </View>
            <View style={[styles.header, styles.bottom, { backgroundColor: Colors.minorThemeColor, minHeight: 300 }]}>
             
              <ScrollView showsVerticalScrollIndicator={false}>
                {
                  vote.get('selectedProducers').map((item, index) => (
                    <View key={index} style={[styles.item, { alignItems: 'center', flexDirection: 'row', marginTop: 10 }]}>
                      <Text style={[styles.text14, { minWidth: 20 }]}> {index+1} </Text>
                      <View style={{ flexDirection: 'row', marginLeft: 25 }}>
                        <View style={[styles.location, styles.center]}>
                          <Text style={ [styles.text14]}>
                            {item.get('location')}
                          </Text>
                        </View>
                        <Text style={ [styles.text14, { marginLeft: 10 }]}>
                          {item.get('name')}
                        </Text>
                      </View>
                    </View>
                  ))
                }
              </ScrollView>

              <TouchableHighlight 
                onPress={onPress} 
                underlayColor={Colors.textColor_89_185_226}
                style={[styles.btn, styles.center]}
              >
                <Text style={[styles.text18]}> 
                  Vote
                </Text>
              </TouchableHighlight>

            </View>
          </View>
        </IntlProvider>
      </Modal>
    )
  }

} 