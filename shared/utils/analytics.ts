
import { NativeModules } from 'react-native'

const UMAnalyticsModule =  NativeModules.UMAnalyticsModule

// event id:
const TEST_EVENT_ID = 'TEST'
const CREATE_EOS_ACCOUNT = 'CREATE_EOS_ACCOUNT'
// const IMPORT_EOS_ACCOUNT = 'IMPORT_EOS_ACCOUNT'

const onEventWithMap = ({ eventId=CREATE_EOS_ACCOUNT, eventData={} }) => (
  UMAnalyticsModule.onEventWithMap(eventId, eventData)
)

const onEventTest = () => {
  UMAnalyticsModule.onEventWithLabel(TEST_EVENT_ID, "TEST")
  // UMAnalyticsModule.onEventWithLabel(`${TEST_EVENT_ID}2`, "TEST")
  // UMAnalyticsModule.onEventWithLabel(`${TEST_EVENT_ID}3`, "TEST")
  // UMAnalyticsModule.onEventWithLabel(`${TEST_EVENT_ID}4`, "TEST")
}

export {
  onEventTest,
  onEventWithMap
}