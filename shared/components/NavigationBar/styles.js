import { StyleSheet, Platform } from "react-native";
import { SCREEN_WIDTH, FontScale, NAV_BAR_HEIGHT, ifIphoneX } from "utils/dimens";
import Colors from "resources/colors";

const styles = StyleSheet.create({
  containerStyle: {
    width: SCREEN_WIDTH,
    height: NAV_BAR_HEIGHT,
    backgroundColor: Colors.mainThemeColor,
<<<<<<< HEAD
    marginBottom: 5,
    justifyContent: "center",
    ...ifIphoneX(
      {
        paddingTop: 24
      },
      {
        paddingTop: 0
      }
    )
=======
    justifyContent: 'center',
    ...ifIphoneX({
      paddingTop: 24
    }, {
      paddingTop: 0
    })
>>>>>>> develop
  },
  textTitle: {
    fontSize: FontScale(18),
    color: Colors.textColor_FFFFEE,
    // fontWeight: "bold",
    width: SCREEN_WIDTH / 2,
    textAlign: "center"
  },
  center: {
    alignItems: "center",
    justifyContent: "center"
  },
  navButton: {
    minWidth: 100,
    height: 40,
<<<<<<< HEAD
    paddingTop: Platform.OS === "ios" ? 6 : 4,
    paddingLeft: 32,
    // marginBottom: 20,
    alignItems: "flex-start",
    justifyContent: "center"
=======
    paddingTop: Platform.OS === 'ios' ? 6 : 4,
    paddingLeft: 20,
    alignItems: 'flex-start',
    justifyContent: 'center'
>>>>>>> develop
  },
  text20: {
    fontSize: FontScale(20),
    color: Colors.textColor_FFFFEE,
    fontWeight: "bold"
  },
  text13: {
    fontSize: FontScale(13),
    color: Colors.textColor_FFFFEE
  }
});

export default styles;
