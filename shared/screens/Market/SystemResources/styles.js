import Colors from "resources/colors";
import {
  SCREEN_WIDTH,
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
