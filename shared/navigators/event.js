import EventEmitter from 'EventEmitter'
import { Navigation } from 'react-native-navigation'
export const events = new EventEmitter()

export const handleOpenURL = (event, componentId, destination) => {
  console.log('handleOpenUrlll', event)
  if (event.url) {
    Navigation.mergeOptions('bottomTabsId', {
      bottomTabs: {
        currentTabIndex: 0
      }
    })
    Navigation.push(componentId, {
      component: {
        name: 'BitPortal.AccountManager'
      }
    })
  }
}
