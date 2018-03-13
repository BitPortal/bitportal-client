export class DataPulseUpdater {
  _datafeed: any
  _subscribers: any
  constructor(datafeed: any) {
    this._datafeed = datafeed
    this._subscribers = {}
  }

  subscribeDataListener (_symbolInfo: any, _resolution: any, newDataCallback: any, listenerGUID: string) {
    if (!this._subscribers.hasOwnProperty(listenerGUID)) {
      this._subscribers[listenerGUID] = {
        symbolInfo: _symbolInfo,
        resolution: _resolution,
        lastBarTime: NaN,
        listeners: []
      }
    }
    this._subscribers[listenerGUID].listeners.push(newDataCallback)
  }

  unsubscribeDataListener (listenerGUID: string) {
    delete this._subscribers[listenerGUID]
  }

  updateData (data: any) {
    const listenerGUIDList = Object.keys(this._subscribers)
    listenerGUIDList.map((key: string) => {
      const listenersList = this._subscribers[key].listeners
      listenersList.map((listeners: any) => {
        listeners(data)
      })
    })
  }

  periodLengthSeconds (resolution: any, requiredPeriodsCount: number) {
    let daysCount = 0

    switch (resolution) {
      case 'D':
        daysCount = requiredPeriodsCount
      case 'M':
        daysCount = 31 * requiredPeriodsCount
      case 'W':
        daysCount = 7 * requiredPeriodsCount
      default:
        daysCount = requiredPeriodsCount * resolution / (24 * 60)
    }

    return daysCount * 24 * 60 * 60
  }
}
