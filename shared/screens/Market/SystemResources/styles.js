import { StyleSheet, Platform } from "react-native";
import Colors from "resources/colors";
import {
  FontScale,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  NAV_BAR_HEIGHT,
  FLOATING_CARD_WIDTH,
  FLOATING_CARD_BORDER_RADIUS,
  FLOATING_CARD_MARGIN_BOTTOM
} from "utils/dimens";

const styles = {
  container: {
    width: SCREEN_WIDTH,
    // justifyContent: "center",
    alignItems: "center"
  },
  tabBar: {
    width: FLOATING_CARD_WIDTH,
    // backgroundColor: "red",
    backgroundColor: Colors.minorThemeColor,
    // flexDirection: "row"
    borderRadius: FLOATING_CARD_BORDER_RADIUS,
    height: 30,
    // alignItems: "center",
    marginBottom: FLOATING_CARD_MARGIN_BOTTOM
  },
  // {
  //   backgroundColor: '#2196f3',
  //   elevation: 4,
  //   shadowColor: 'black',
  //   shadowOpacity: 0.1,
  //   shadowRadius: StyleSheet.hairlineWidth,
  //   shadowOffset: {
  //     height: StyleSheet.hairlineWidth,
  //   },
  //   // We don't need zIndex on Android, disable it since it's buggy
  //   zIndex: Platform.OS === 'android' ? 0 : 1,
  // }
  singleTab: {
    // height: 30,
    // width: 30,
    height: 30,
    width: FLOATING_CARD_WIDTH / 3,
    padding: 0,
    margin: 0,
    borderRadius: FLOATING_CARD_BORDER_RADIUS
    // backgroundColor: "pink"
  },
  selectedTab: {
    height: 30,
    width: FLOATING_CARD_WIDTH / 3,
    borderRadius: FLOATING_CARD_BORDER_RADIUS,
    // borderWidth: 3,
    // borderStyle: "solid",
    // borderColor: "white",
    backgroundColor: "blue"
  }
};

export default styles;
