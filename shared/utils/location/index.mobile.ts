import { Navigation } from 'react-native-navigation'

export const push = (location: string, passProps?: object) => {
  Navigation.handleDeepLink({
    link: '*',
    payload: {
      method: 'push',
      params: {
        passProps,
        screen: location
      }
    }
  })
}

export const pop = () => {
  Navigation.handleDeepLink({
    link: '*',
    payload: {
      method: 'pop'
    }
  })
}

export const popToRoot = () => {
  Navigation.handleDeepLink({
    link: '*',
    payload: {
      method: 'popToRoot',
      params: {}
    }
  })
}
