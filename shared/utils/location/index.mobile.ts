import { Navigation } from 'react-native-navigation'

export const push = (location: string, componentId, passProps?: object) => {
  Navigation.push(componentId, {
    component: {
      passProps,
      name: location
    }
  })
}

export const pop = (componentId) => {
  Navigation.pop(componentId)
}

export const popToRoot = (componentId) => {
  Navigation.popToRoot(componentId)
}
