import { StyleSheet, PixelRatio, Platform } from 'react-native'
import { SCREEN_HEIGHT, SCREEN_WIDTH, FontScale, ifIphoneX, WidthPercent, HeightPercent } from 'utils/dimens'
import Colors from 'resources/colors'

const scale = Platform.OS == 'ios' ? 2.7 : 2.4
const cardScale = Platform.OS == 'ios' ? 1 : 0.9
const titleScale = Platform.OS == 'ios' ? 0.75 : 0.75 

const styles = StyleSheet.create({
  imageBackground: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT
  },
  wrapper: {
    width: SCREEN_WIDTH*scale,
    height: SCREEN_WIDTH*scale*652/935,
    marginTop: -SCREEN_HEIGHT
  },
  pageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: FontScale(17),
    color: Colors.textColor_216_216_216
  },
  dot: {
    width: 8, 
    height: 8,
    borderRadius: 1,
    margin: 3,
    backgroundColor: Colors.bgColor_59_59_59, 
  },
  activeDot: {
    width: 8, 
    height: 8, 
    borderRadius: 1,
    margin: 3,
    backgroundColor: Colors.bgColor_FAFAFA
  },
  paginationStyle: { 
    paddingLeft: WidthPercent(15), 
    justifyContent: 'flex-start',
    ...ifIphoneX({ 
      marginBottom: 34,
      bottom: 40,
    },{
      marginBottom: 0,
      bottom: 40,
    })
  },
  imageBg: {
    width: SCREEN_WIDTH*scale,
    height: SCREEN_WIDTH*scale*653/935,
    marginTop: Platform.OS == 'ios' ? 40 : 10,
    marginLeft: Platform.OS == 'ios' ? 420 : 400
  },
  imageCard: {
    width: SCREEN_WIDTH*cardScale,
    height: SCREEN_WIDTH*cardScale*310/355,
    marginTop: Platform.OS == 'ios' ? 40 : 40,
    marginLeft: Platform.OS == 'ios' ? 140 : 126
  },
  imageCard2: {
    width: SCREEN_WIDTH*cardScale,
    height: SCREEN_WIDTH*cardScale*310/355,
    marginTop: Platform.OS == 'ios' ? 55 : 50,
    marginLeft: Platform.OS == 'ios' ? 153 : 126
  },
  imageCard3: {
    width: SCREEN_WIDTH*cardScale,
    height: SCREEN_WIDTH*cardScale*310/355,
    marginTop: Platform.OS == 'ios' ? 45 : 35,
    marginLeft: Platform.OS == 'ios' ? 120 : 110
  },
  imageTitle: {
    position: 'absolute',
    width: SCREEN_WIDTH*titleScale,
    height: SCREEN_WIDTH*titleScale*54/266,
    left: WidthPercent(16), 
    ...ifIphoneX({ 
      marginBottom: 34,
      bottom: HeightPercent(20),
    },{
      marginBottom: 0,
      bottom: HeightPercent(20),
    })
  },
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_255_255_238
  },
  btn: {
    width: 100,
    height: 44,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnContainer: {
    position: 'absolute',
    right: WidthPercent(15), 
    ...ifIphoneX({ 
      marginBottom: 34,
      bottom: 30,
    },{
      marginBottom: 0,
      bottom: 30,
    })
  }
})

export default styles