import { Navigation } from 'components/Navigation'
import { setBottomTabsLocale } from 'navigators'

export const push = (location: string, componentId: string, passProps: object = {}, options: object = {}) => {
  Navigation.push(componentId, {
    component: {
      passProps,
      options,
      name: location
    }
  })
}

export const pop = (componentId: string) => {
  Navigation.pop(componentId)
}

export const popToRoot = (componentId: string) => {
  Navigation.popToRoot(componentId)
}

export const dismissAllModals = () => {
  Navigation.dismissAllModals()
}

export const setExtraLocale = (locale: Locale) => {
  setBottomTabsLocale(locale)
}

export const showModal = (options: any) => {
  Navigation.showModal(options)
}

export const mergeOptions = (componentId: string, options: any) => {
  Navigation.mergeOptions(componentId, options)
}
