import { Navigation } from 'react-native-navigation';
import Images from 'resources/images'
import { SCREEN_WIDTH } from 'utils/dimens'
import { PixelRatio } from 'react-native';

export const startSingleApp = () => {
  Navigation.startSingleScreenApp({
    screen: {
    screen: 'BitPortal.Welcome', // unique ID registered with Navigation.registerScreen
    navigatorStyle: { navBarHidden: true } // override the navigator style for the screen, see "Styling the navigator" below (optional)
    },
    animationType: 'fade' // optional, add transition animation to root change: 'none', 'slide-down', 'fade'
  });
}

export const startTabBasedApp = () => {
  Navigation.startTabBasedApp({
    tabs: [
      {
        label: 'Market', // tab label as appears under the icon in iOS (optional)
        title: 'Market',
        screen: 'BitPortal.Market', // unique ID registered with Navigation.registerScreen
        icon: Images.home, // local image asset for the tab icon unselected state (optional on iOS)
        selectedIcon: Images.home_press, // local image asset for the tab icon selected state (optional, iOS only. On Android, Use `tabBarSelectedButtonColor` instead)
        navigatorStyle: { navBarHidden: true }, // override the navigator style for the tab screen, see "Styling the navigator" below (optional),
        navigatorButtons: {} // override the nav buttons for the tab screen, see "Adding buttons to the navigator" below (optional)
      },
      {
        label: 'Portfolio',
        title: 'Portfolio',
        screen: 'BitPortal.Market',
        icon: Images.home,
        selectedIcon: Images.home_press,
        navigatorStyle: { navBarHidden: true }
      },
      {
        label: 'Community',
        title: 'Community',
        screen: 'BitPortal.Market',
        icon: Images.home,
        selectedIcon: Images.home_press,
        navigatorStyle: { navBarHidden: true }
      },
      {
        label: 'Setting',
        title: 'Setting',
        screen: 'BitPortal.Market',
        icon: Images.account,
        selectedIcon: Images.account_press,
        navigatorStyle: { navBarHidden: true }
      }
    ],
    tabsStyle: { // optional, add this if you want to style the tab bar beyond the defaults
      tabBarButtonColor: 'gray', // optional, change the color of the tab icons and text (also unselected). On Android, add this to appStyle
      tabBarSelectedButtonColor: '#eeeeee', // optional, change the color of the selected tab icon and text (only selected). On Android, add this to appStyle
      tabBarBackgroundColor: '#33333333', // optional, change the background color of the tab bar
      initialTabIndex: 0, // optional, the default selected bottom tab. Default: 0. On Android, add this to appStyle
      tabBarHideShadow: false
    },
    drawer: { // optional, add this if you want a side menu drawer in your app
      left: { // optional, define if you want a drawer from the left
        screen: 'BitPortal.SideMenu', // unique ID registered with Navigation.registerScreen
        passProps: {}, // simple serializable object that will pass as props to all top screens (optional),
        fixedWidth: SCREEN_WIDTH*PixelRatio.get()*2/3, // a fixed width you want your left drawer to have (optional)
      },
      style: { // ( iOS only )
        drawerShadow: false, // optional, add this if you want a side menu drawer shadow
        contentOverlayColor: 'rgba(0,0,0,0.25)', // optional, add this if you want a overlay color when drawer is open
        leftDrawerWidth: 66.67, // optional, add this if you want a define left drawer width (50=percent)
        shouldStretchDrawer: true // optional, iOS only with 'MMDrawer' type, whether or not the panning gesture will “hard-stop” at the maximum width for a given drawer side, default : true
      },
      type: 'MMDrawer', // optional, iOS only, types: 'TheSideBar', 'MMDrawer' default: 'MMDrawer'
      animationType: 'parallax', //optional, iOS only, for MMDrawer: 'door', 'parallax', 'slide', 'slide-and-scale'
                                          // for TheSideBar: 'airbnb', 'facebook', 'luvocracy','wunder-list'
      disableOpenGesture: false // optional, can the drawer be opened with a swipe instead of button
    },
    animationType: 'fade' // optional, add transition animation to root change: 'none', 'slide-down', 'fade'
  });
}
