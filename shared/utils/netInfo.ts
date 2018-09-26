import { NetInfo } from 'react-native'
import Dialog from 'components/Dialog'
import messages from 'resources/messages'

const startListenNetInfo = (locale: string) => {
  NetInfo.addEventListener(
    'connectionChange',
    (info) => handleConnectionInfoChange(info, locale)
  )
}

const alertInfo = (type: any, locale: any) => {
  switch (type) {
    case 'none':
      Dialog.alert(
        messages[locale].general_error_popup_text_network_unconnected, 
        null,
        { negativeText: messages[locale].general_popup_button_close }
      )
      break;
    case 'wifi':
      break;
    case 'cellular':
      break;
    case 'unknown':
      break;
    default:
      break;
  }
}

const handleConnectionInfoChange = (connectionInfo: any, locale: string) => {
  console.log('###', connectionInfo)
  let type = connectionInfo && connectionInfo.type
  alertInfo(type, locale)
  NetInfo.removeEventListener(
    'connectionChange',
    (info) => handleConnectionInfoChange(info, locale)
  )
};

export { startListenNetInfo }