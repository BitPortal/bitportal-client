import React, { Component } from 'react'
import Images from 'resources/images'
import Colors from 'resources/colors'
import {
  Image,
  View,
  StyleSheet
} from 'react-native'
import { SCREEN_WDITH, SCREEN_HEIGHT, NAV_BAR_HEIGHT } from 'utils/dimens'
import Modal from 'react-native-modal'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WDITH,
    height: SCREEN_HEIGHT
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: 60,
    height: 60
  },
  border: {
    width: 80,
    height: 80,
    borderRadius: 4,
    padding: 10,
    backgroundColor: Colors.mainThemeColor
  }
})

const imageArr = [
  Images.loading1,  Images.loading2,  Images.loading3,  Images.loading4, 
  Images.loading5,  Images.loading6,  Images.loading7,  Images.loading8, 
  Images.loading9,  Images.loading10, Images.loading11, Images.loading12,
  Images.loading13, Images.loading14, Images.loading15, Images.loading16
]

export default class Loading extends Component {

  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  state = {
    imageIndex: 0
  }

  startTimer = () => {
    this.timer = setInterval(() => {
      this.state.imageIndex++
      this.setState({ imageIndex: this.state.imageIndex%16  })
    }, 80)
  }

  componentDidMount() {
    this.startTimer()
  }

  componentWillUnmount() {
    this.timer && clearInterval(this.timer)
  }

  render () {
    const { disabledBorder, extraStyle, isVisible, backdropOpacity } = this.props
    const borderStyle = disabledBorder ? {} : styles.border
    return (
      <Modal
        animationIn="fadeIn"
        animationOut="fadeOut"
        isVisible={isVisible}
        backdropOpacity={backdropOpacity ? backdropOpacity : 0.3}
      >
          <View style={[styles.container, styles.center, extraStyle]}>
            <View style={borderStyle}>
              <Image source={imageArr[this.state.imageIndex]} style={styles.image}/>
            </View>
          </View>
      </Modal>
    )
  }

}
