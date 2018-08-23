
import { NativeModules } from 'react-native'

const UMAnalyticsModule =  NativeModules.UMAnalyticsModule

const date = new Date().toLocaleDateString

// custom event:

const onEvent = (eventId: string) => UMAnalyticsModule.onEvent(eventId)

const onEventWithLabel = (eventId: string, eventLabel: string) => (
  UMAnalyticsModule.onEventWithLabel(eventId, eventLabel)
)

const onEventWithMap = (eventId: string, eventData: object) => (
  UMAnalyticsModule.onEventWithMap(eventId, Object.assign(eventData, { date }))
)

const onEventWithMapAndCount = (eventId: string, eventData: object, eventNum: string) => (
  UMAnalyticsModule.onEventWithMapAndCount(eventId, Object.assign(eventData, { date }), eventNum)
)

// track event:

const onEventTrack = (eventName: string) => UMAnalyticsModule.track(eventName)

const onEventTrackWithMap = (eventName: string, property: object) => (
  UMAnalyticsModule.trackWithMap(eventName, Object.assign(property, { date }))
)

export {
  onEvent,
  onEventWithLabel,
  onEventWithMap,
  onEventWithMapAndCount,
  onEventTrack,
  onEventTrackWithMap
}