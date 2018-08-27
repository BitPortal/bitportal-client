// import { fetchBase } from './api'

export class Datafeeds {
  _datafeedURL: string
  _configuration: any
  _symbolSearch: any
  _symbolsStorage: any
  _barsPulseUpdater: any
  _enableLogging: boolean
  _initializationFinished: boolean
  _callbacks: any
  _supportedResolutions: string[] = ['1', '5', '15', '30', '60', '180', '360', '720', 'D', 'W']
  _defaultConfig: any = {
    supports_search: false,
    supports_group_request: true,
    supports_marks: false,
    supports_timescale_marks: false,
    supported_resolutions: this._supportedResolutions,
    exchanges: [{
      value: '',
      name: 'All Exchanges',
      desc: ''
    }],
    symbols_types: [{
      name: 'All types',
      value: ''
    }]
  }
  _symbolInfo: any = {
    currency_code: 'USD',
    description: 'XUC/BTC',
    'exchange-listed': 'XUC',
    'exchange-traded': 'XUC',
    fractional: false,
    has_intraday: true,
    has_no_volume: false,
    minmov: 1,
    minmov2: 2,
    name: 'XUC_BTC',
    pricescale: '1',
    supported_resolutions: this._supportedResolutions,
    ticker: 'XUC_BTC',
    session: '24x7',
    timezone: 'UTC'
  }

  constructor(config: {}, symbolInfo: {}, DataPulseUpdater: any) {
    this._configuration = undefined
    this._symbolSearch = null
    this._symbolsStorage = null
    this._barsPulseUpdater = DataPulseUpdater
    this._enableLogging = false
    this._initializationFinished = false
    this._callbacks = {}

    Object.keys(symbolInfo).map((key: string) => {
      this._symbolInfo[key] = symbolInfo[key]
    })
    Object.keys(config).map((key: string) => {
      this._defaultConfig[key] = config[key]
    })

    this.initialize()
  }

  on (event: any, callback: any) {
    if (!this._callbacks.hasOwnProperty(event)) {
      this._callbacks[event] = []
    }
    this._callbacks[event].push(callback)
    return this
  }

  fireEvent (event: any, argument?: any)  {
    if (this._callbacks.hasOwnProperty(event)) {
      const callbacksChain = this._callbacks[event]
      callbacksChain.map((item: any) => {
        item.call(this, argument)
      })
      this._callbacks[event] = []
    }
  }

  onInitialized () {
    this._initializationFinished = true
    this.fireEvent('initialized')
  }

  initialize () {
    this._configuration = this._defaultConfig
    this.onInitialized()
    this.fireEvent('configuration_ready')
  }

  onReady (callback: any) {
    if (this._configuration) {
      setTimeout(() => {
        callback(this._configuration)
      }, 0)
    } else {
      this.on('configuration_ready', () => {
        callback(this._configuration)
      })
    }
  }

  resolveSymbol (symbolName: any, onSymbolResolvedCallback: any, onResolveErrorCallback: any) {
    if (!this._initializationFinished) {
      this.on('initialized', () => {
        this.resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback)
      })
      return
    }
    setTimeout(() => {
      onSymbolResolvedCallback(this._symbolInfo)
    })
  }

  getBars (symbolInfo: any, resolutionValue: any, rangeStartDate: any, rangeEndDate: any, onDataCallback: any, onErrorCallback: any) {
    if (rangeStartDate > 0 && (rangeStartDate + '').length > 10) {
      throw new Error(['Got a JS time instead of Unix one.', rangeStartDate, rangeEndDate] as any)
    }

    const url = '/charting_library/datafeed/udf/data.json'
    const options: object = {
      method: 'GET',
      body: {
        symbol: symbolInfo.ticker.toUpperCase(),
        resolution: resolutionValue,
        from: rangeStartDate,
        to: rangeEndDate
      }
    }
    fetch(url, options).then((response: any) => {
      return response.json()
    }).then((data: any) => {
      let nodata = false
      let newData = data
      if (new Date(rangeStartDate * 1000) < new Date(1511691808000)) {
        nodata = true
        newData = []
      }
      const bars = newData
      onDataCallback(bars,  { noData: nodata })
    }).catch((arg: any) => {
      console.warn(['getBars(): HTTP error', arg])

      if (!!onErrorCallback) {
        onErrorCallback('network error: ' + JSON.stringify(arg))
      }
    })
  }

  subscribeBars (symbolInfo: any, resolution: any, onRealtimeCallback: any, listenerGUID: any, onResetCacheNeededCallback: any) {
    this._barsPulseUpdater.subscribeDataListener(symbolInfo, resolution, onRealtimeCallback, listenerGUID, onResetCacheNeededCallback)
  }

  unsubscribeBars (listenerGUID: string) {
    this._barsPulseUpdater.unsubscribeDataListener(listenerGUID)
  }
}
