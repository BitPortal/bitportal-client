import { Navigation } from 'react-native-navigation'
import querystring from 'querystring'
import { deepLinkReady } from 'store'

const PERMITTED_ROUTES = ['AssetsTransfer']

const checkLoaded = timeoutms =>
  new Promise((r, j) => {
    const check = () => {
      if (deepLinkReady() === true) r()
      else if (timeoutms <= 500) j(new Error('loading timeout'))
      else {
        timeoutms -= 500
        setTimeout(check, 500)
      }
    }
    setTimeout(check, 500)
  })

export const handleOpenURL = async (event, componentId) => {
  await checkLoaded(10000)
  if (event.url && event.url.includes('bitportal://app?') && deepLinkReady()) {
    const params = querystring.parse(event.url.replace('bitportal://app?', ''))
    if (PERMITTED_ROUTES.includes(params.screen)) {
      Navigation.mergeOptions('bottomTabsId', {
        bottomTabs: {
          currentTabIndex: 0
        }
      })
      Navigation.push(componentId, {
        component: {
          name: `BitPortal.${params.screen}`,
          passProps: { ...params }
        }
      })
    }
  }
}
