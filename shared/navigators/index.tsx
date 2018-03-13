import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addNavigationHelpers, StackNavigator, TabNavigator } from 'react-navigation'
import Market from 'screens/Market'
import Profile from 'screens/Profile'
import Settings from 'screens/Settings'
import Login from 'screens/Login'
import Register from 'screens/Register'

const RegisterStack = StackNavigator({
  Register: {
    screen: Register,
    path: '/',
    navigationOptions: {
      title: 'Register'
    }
  }
})

const LoginStack = StackNavigator({
  Login: {
    screen: Login,
    path: '/',
    navigationOptions: {
      title: 'Login'
    }
  }
})

const MarketStack = StackNavigator({
  Market: {
    screen: Market,
    path: '/',
    navigationOptions: {
      header: false
    }
  }
})

const SettingsStack = StackNavigator({
  Settings: {
    screen: Settings,
    path: '/',
    navigationOptions: {
      title: 'Settings'
    }
  },
  Profile: {
    screen: Profile,
    path: '/profile',
    navigationOptions: {
      title: 'Profile'
    }
  }
})

const Tabs = TabNavigator(
  {
    Market: {
      screen: MarketStack,
      path: '/market',
      navigationOptions: {
        tabBarLabel: '行情',
        tabBarIcon: null
      }
    },
    Settings: {
      screen: SettingsStack,
      path: '/settings',
      navigationOptions: {
        tabBarLabel: '设置',
        tabBarIcon: null
      }
    }
  },
  {
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
    tabBarOptions: {
      activeTintColor: '#fdfdee',
      style: {
        backgroundColor: '#2c2c2c',
        borderTopColor: '#494949'
      }
    }
  }
)

export const Navigator = StackNavigator(
  {
    Tabs: { screen: Tabs },
    Login: { screen: LoginStack },
    Register: { screen: RegisterStack }
  },
  {
    headerMode: 'none',
    mode: 'modal'
  }
)

interface Props {
  dispatch?: any
  navigator?: any
}

@connect(
  (state: any) => ({
    navigator: state.navigator
  })
)

export default class AppWithNavigationState extends Component<Props, object> {
  render() {
    const { dispatch, navigator } = this.props

    return (
      <Navigator navigation={addNavigationHelpers({ dispatch, state: navigator })} />
    )
  }
}
