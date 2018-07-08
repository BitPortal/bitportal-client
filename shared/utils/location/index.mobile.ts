import { Navigation } from 'react-native-navigation'
import { setBottomTabsLocale } from 'navigators'

export const push = (location: string, componentId: string, passProps?: object) => {
  Navigation.push(componentId, {
    component: {
      passProps,
      name: location
    }
  })
}

export const pop = (componentId: string) => {
  Navigation.pop(componentId, null)
}

export const popToRoot = (componentId: string) => {
  Navigation.popToRoot(componentId)
}

export const setExtraLocale = (locale: Locale) => {
  setBottomTabsLocale(locale)
}
