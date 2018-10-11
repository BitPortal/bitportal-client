import { StyleSheet } from "react-native";
import {
  FontScale,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  NAV_BAR_HEIGHT,
  FLOATING_CARD_WIDTH,
  FLOATING_CARD_BORDER_RADIUS
} from "utils/dimens";
import Colors from "resources/colors";

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    backgroundColor: Colors.mainThemeColor,
    alignItems: "center",
    marginBottom: 10
  },
  scrollContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - NAV_BAR_HEIGHT
  },
  cardContainer: {
    width: FLOATING_CARD_WIDTH,
    minHeight: 100,
    // paddingVertical: 10,
    paddingHorizontal: 25,
    backgroundColor: Colors.minorThemeColor,
    borderRadius: FLOATING_CARD_BORDER_RADIUS
  },
  innerCardContainer: {
    minHeight: 50,
    backgroundColor: Colors.borderColor_48_48_46,
    borderRadius: FLOATING_CARD_BORDER_RADIUS,
    width: FLOATING_CARD_WIDTH / 2 - 25,
    marginVertical: 15,
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center"
  },
  spaceBetween: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row"
  },
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_255_255_238
  },
  text18: {
    fontSize: FontScale(18),
    color: Colors.textColor_255_255_238
  },
  text16: {
    fontSize: FontScale(16),
    color: Colors.textColor_255_255_238
  },
  text26: {
    fontSize: FontScale(26),
    fontWeight: "bold",
    color: Colors.textColor_255_255_238
  },
  keyText: {
    fontSize: FontScale(14),
    color: Colors.textColor_107_107_107
  },
  headerText: {
    fontSize: FontScale(16),
    color: Colors.textColor_89_185_226
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 15,
    paddingTop: 20
  },
  icon: {
    width: 43,
    height: 43,
    borderRadius: 25
  },
  center: {
    alignItems: "center",
    justifyContent: "center"
    // margin: 1
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  column: {
    flexDirection: "column",
    // alignItems: "center"
    justifyContent: "center"
    // backgroundColor: "red"
  },
  tag: {
    // minWidth: 55,
    paddingHorizontal: 5,
    borderRadius: 6,
    padding: 0,
    justifyContent: "center",
    borderColor: Colors.borderColor_41_41_38,
    borderWidth: 1,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 5,
    backgroundColor: Colors.borderColor_41_41_38
  },
  miniTag: {
    minWidth: 30,
    borderRadius: 6,
    justifyContent: "center",

    backgroundColor: Colors.borderColor_41_41_38
  }
});

export default styles;
