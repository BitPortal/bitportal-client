import { Navigation } from 'react-native-navigation'

export const push = (location: string, componentId: string, passProps?: object) => {
  Navigation.push(componentId, {
    component: {
      passProps,
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
