/* @jsx */
import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, TouchableHighlight } from 'react-native'
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
    marginTop: 40,
    marginBottom: 20
  }
})

@connect(
  (state) => ({
    locale: state.intl.get('locale')
  })
)

export default class VoteModal extends Component {

  render() {
    const { isVisible, item, myVote, dismissModal, vote, locale } = this.props
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
              <Text style={styles.text18}> Vote </Text>
              <Text style={styles.text18}> {' '} </Text>
            </View>
            <View style={[styles.header, styles.bottom, { backgroundColor: Colors.minorThemeColor, minHeight: 300 }]}>
             
              <View style={[styles.item, { alignItems: 'center', flexDirection: 'row', marginTop: 24 }]}>
                <Text style={[styles.text14, { minWidth: 100 }]}> Node Name </Text>
                <View style={{ flexDirection: 'row', marginLeft: 35 }}>
                  <View style={[styles.location, styles.center]}>
                    <Text style={ [styles.text14]}>
                      {item.location}
                    </Text>
                  </View>
                  <Text style={ [styles.text14, { marginLeft: 10 }]}>
                    {item.name}
                  </Text>
                </View>
              </View>

              <View style={[styles.item, { alignItems: 'center', flexDirection: 'row', marginTop: 5 }]}>
                <Text style={[styles.text14, { minWidth: 100 }]}> Rank </Text>
                <Text style={ [styles.text14, { marginLeft: 35 }]}>
                  {item.id && parseInt(item.id.substring(0,1))+1}
                </Text>
              </View>

              <View style={styles.line} />

              <View style={[styles.item, { alignItems: 'center', flexDirection: 'row', marginTop: 5 }]}>
                <Text style={[styles.text14, { minWidth: 100 }]}> Total Votes </Text>
                <Text style={ [styles.text14, { color: Colors.textColor_89_185_226, marginLeft: 35 }]}>
                  {item.totalVotes}
                </Text>
              </View>

              <View style={[styles.item, { alignItems: 'center', flexDirection: 'row', marginTop: 5 }]}>
                <Text style={[styles.text14, { minWidth: 100 }]}> My Votes </Text>
                <Text style={ [styles.text14, { color: Colors.textColor_89_185_226, marginLeft: 35 }]}>
                  12345
                </Text>
              </View>

              <TouchableHighlight 
                onPress={() => vote(item)} 
                underlayColor={Colors.textColor_89_185_226}
                style={[styles.btn, styles.center]}
              >
                <Text style={[styles.text18]}> 
                  ok
                </Text>
              </TouchableHighlight>

            </View>
          </View>
        </IntlProvider>
      </Modal>
    )
  }

} 