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
    // width: FLOATING_CARD_WIDTH,
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
    paddingVertical: 10,
    paddingHorizontal: 25,
    backgroundColor: Colors.minorThemeColor,
    borderRadius: FLOATING_CARD_BORDER_RADIUS
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
  headerText: {
    fontSize: FontScale(16),
    color: Colors.textColor_89_185_226
  },
  keyText: {
    fontSize: FontScale(14),
    color: Colors.textColor_80_80_80
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  row: {
    flexDirection: "row"
    // alignItems: 'center'
    // justifyContent: 'center'
  },
  tag: {
    minWidth: 60,
    borderRadius: 4,
    padding: 2,
    borderColor: Colors.textColor_89_185_226,
    borderWidth: 1,
    marginRight: 10
  },
  detailPanelTitle: {
    paddingVertical: 12,
    paddingBottom: 13
  },
  hairlineSpacer: {
    height: 1,
    width: "100%",
    backgroundColor: "black",
    opacity: 0.3
  },
  textContainer: {
    paddingVertical: 13,
    textAlign: "center"
  }
});

export default styles;
