import { StyleSheet } from "react-native";
import Colors from "resources/colors";
import { FontScale, SCREEN_WIDTH, SCREEN_HEIGHT, NAV_BAR_HEIGHT } from "utils/dimens";

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT
  },
  listContainer: {
    width: SCREEN_WIDTH,
    height: 50,
    borderBottomColor: Colors.mainThemeColor,
    borderBottomWidth: 1,
    backgroundColor: Colors.bgColor_30_31_37
  },
  bgContainer: {
    width: SCREEN_WIDTH,
    marginTop: NAV_BAR_HEIGHT - SCREEN_HEIGHT
  },
  between: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row"
  },
  text16: {
    fontSize: FontScale(16),
    fontWeight: "normal",
    color: Colors.textColor_255_255_238
  }
});

export default styles;
