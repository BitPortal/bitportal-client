import 'core-js/es6'
import { createMemoryHistory } from 'history'
// import storage from 'utils/storage'
import { wrapStore } from 'react-chrome-redux'
import Transit from 'transit-immutable-js'
import { getInitialLang } from 'selectors/intl'
import configure from 'store'
import sagas from 'sagas'

const memoryHistory = createMemoryHistory()
const lang = 'en'
const store = configure({ intl: getInitialLang(lang) }, memoryHistory)

wrapStore(store, {
  portName: 'BITPORTAL',
  serializer: (payload: any) => Transit.toJSON(payload),
  deserializer: (payload: any) => Transit.fromJSON(payload)
})

store.runSaga(sagas)

chrome.runtime.onMessage.addListener(
  (request: any, sender: any) => {
	if(sender.id !== chrome.runtime.id || request.type === 'chromex.dispatch') return
    console.log(request)
	return true
  }
)
