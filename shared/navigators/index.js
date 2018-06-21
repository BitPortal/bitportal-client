import { Navigation } from 'react-native-navigation'
import Images from 'resources/images'
import Colors from 'resources/colors'

export const startSingleApp = () => {
  Navigation.startSingleScreenApp({
    screen: {
      screen: 'BitPortal.Welcome', // unique ID registered with Navigation.registerScreen
      navigatorStyle: { navBarHidden: true } // override the navigator style for the screen, see "Styling the navigator" below (optional)
    },
    animationType: 'fade' // optional, add transition animation to root change: 'none', 'slide-down', 'fade'
  })
}

export const startTabBasedApp = (tabLabels) => {
  Navigation.startTabBasedApp({
    tabs: [
      {
        label: `${tabLabels.general_tab_name_ast}`, // tab label as appears under the icon in iOS (optional)
        screen: 'BitPortal.Assets', // unique ID registered with Navigation.registerScreen
        icon: Images.asset, // local image asset for the tab icon unselected state (optional on iOS)
        selectedIcon: Images.asset_press // local image asset for the tab icon selected state (optional, iOS only. On Android, Use `tabBarSelectedButtonColor` instead)
      },
      {
        label: `${tabLabels.general_tab_name_mkt}`,
        screen: 'BitPortal.Market',
        icon: Images.market,
        selectedIcon: Images.market_press
      },
      {
        label: `${tabLabels.general_tab_name_dscv}`,
        screen: 'BitPortal.Discovery',
        icon: Images.discovery,
        selectedIcon: Images.discovery_press
      },
      {
        label: `${tabLabels.general_tab_name_prf}`,
        screen: 'BitPortal.Profile',
        icon: Images.profile,
        selectedIcon: Images.profile_press
      }
    ],
    tabsStyle: { // optional, add this if you want to style the tab bar beyond the defaults
      tabBarButtonColor: 'gray', // optional, change the color of the tab icons and text (also unselected). On Android, add this to appStyle
      tabBarSelectedButtonColor: Colors.textColor_89_185_226, // optional, change the color of the selected tab icon and text (only selected). On Android, add this to appStyle
      tabBarBackgroundColor: Colors.minorThemeColor, // optional, change the background color of the tab bar
      initialTabIndex: 0, // optional, the default selected bottom tab. Default: 0. On Android, add this to appStyle
      tabBarHideShadow: false
    },
    appStyle: {
      forceTitlesDisplay: true,
      screenBackgroundColor: Colors.mainThemeColor,
      orientation: 'portrait', // Sets a specific orientation to the entire app. Default: 'auto'. Supported values: 'auto', 'landscape', 'portrait'
      bottomTabBadgeTextColor: 'red', // Optional, change badge text color. Android only
      bottomTabBadgeBackgroundColor: 'green', // Optional, change badge background color. Android only
      hideBackButtonTitle: true, // Hide back button title. Default is false. If `backButtonTitle` provided so it will take into account and the `backButtonTitle` value will show. iOS only
      tabBarButtonColor: 'gray', // optional, change the color of the tab icons and text (also unselected). On Android, add this to appStyle
      tabBarSelectedButtonColor: Colors.textColor_89_185_226, // optional, change the color of the selected tab icon and text (only selected). On Android, add this to appStyle
      tabBarBackgroundColor: Colors.minorThemeColor, // optional, change the background color of the tab bar
      initialTabIndex: 0
    },
    animationType: 'fade' // optional, add transition animation to root change: 'none', 'slide-down', 'fade'
  })
}
