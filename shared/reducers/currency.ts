import { handleActions } from 'utils/redux'
import * as actions from 'actions/currency'

const initialState = {
  list: {
    "USD": {
      "sign": "$",
      "symbol": "USD",
      "rate": 1
    },
    "CNY": {
      "sign": "¥",
      "symbol": "CNY",
      "rate": 6.922305
    },
    "JPY": {
      "sign": "¥",
      "symbol": "JPY",
      "rate": 108.416735
    },
    "KRW": {
      "sign": "₩",
      "symbol": "KRW",
      "rate": 1182.393864
    },
    "EUR": {
      "sign": "€",
      "symbol": "EUR",
      "rate": 0.885546
    },
    "TWD": {
      "sign": "NT$",
      "symbol": "TWD",
      "rate": 31.425364
    },
    "ARS": {
      "sign": "$",
      "symbol": "ARS",
      "rate": 43.648869
    },
    "AUD": {
      "sign": "$",
      "symbol": "AUD",
      "rate": 1.445223
    },
    "BGN": {
      "sign": "лв",
      "symbol": "BGN",
      "rate": 1.732375
    },
    "BRL": {
      "sign": "R$",
      "symbol": "BRL",
      "rate": 3.852377
    },
    "BSD": {
      "sign": "$",
      "symbol": "BSD",
      "rate": 1
    },
    "CAD": {
      "sign": "$",
      "symbol": "CAD",
      "rate": 1.3312
    },
    "CHF": {
      "sign": "CHF",
      "symbol": "CHF",
      "rate": 0.993519
    },
    "CLP": {
      "sign": "$",
      "symbol": "CLP",
      "rate": 695.197943
    },
    "COP": {
      "sign": "$",
      "symbol": "COP",
      "rate": 3309
    },
    "CZK": {
      "sign": "Kč",
      "symbol": "CZK",
      "rate": 22.643216
    },
    "DKK": {
      "sign": "kr",
      "symbol": "DKK",
      "rate": 6.60997
    },
    "DOP": {
      "sign": "RD$",
      "symbol": "DOP",
      "rate": 50.317886
    },
    "EGP": {
      "sign": "£",
      "symbol": "EGP",
      "rate": 16.716141
    },
    "FJD": {
      "sign": "$",
      "symbol": "FJD",
      "rate": 2.164497
    },
    "GBP": {
      "sign": "£",
      "symbol": "GBP",
      "rate": 0.78795
    },
    "GTQ": {
      "sign": "Q",
      "symbol": "GTQ",
      "rate": 7.693645
    },
    "HKD": {
      "sign": "$",
      "symbol": "HKD",
      "rate": 7.826709
    },
    "HRK": {
      "sign": "kn",
      "symbol": "HRK",
      "rate": 6.565965
    },
    "HUF": {
      "sign": "Ft",
      "symbol": "HUF",
      "rate": 284.969184
    },
    "IDR": {
      "sign": "Rp",
      "symbol": "IDR",
      "rate": 14227.966087
    },
    "ILS": {
      "sign": "₪",
      "symbol": "ILS",
      "rate": 3.589709
    },
    "ISK": {
      "sign": "kr",
      "symbol": "ISK",
      "rate": 125.305989
    },
    "KZT": {
      "sign": "лв",
      "symbol": "KZT",
      "rate": 383.917127
    },
    "MXN": {
      "sign": "$",
      "symbol": "MXN",
      "rate": 19.176422
    },
    "MYR": {
      "sign": "RM",
      "symbol": "MYR",
      "rate": 4.163811
    },
    "NOK": {
      "sign": "kr",
      "symbol": "NOK",
      "rate": 8.65865
    },
    "NZD": {
      "sign": "$",
      "symbol": "NZD",
      "rate": 1.522437
    },
    "PAB": {
      "sign": "B/.",
      "symbol": "PAB",
      "rate": 1
    },
    "PEN": {
      "sign": "S/.",
      "symbol": "PEN",
      "rate": 3.330501
    },
    "PHP": {
      "sign": "₱",
      "symbol": "PHP",
      "rate": 51.875452
    },
    "PKR": {
      "sign": "₨",
      "symbol": "PKR",
      "rate": 151.392157
    },
    "PLN": {
      "sign": "zł",
      "symbol": "PLN",
      "rate": 3.767938
    },
    "PYG": {
      "sign": "Gs",
      "symbol": "PYG",
      "rate": 6317.181818
    },
    "RON": {
      "sign": "lei",
      "symbol": "RON",
      "rate": 4.182625
    },
    "RUB": {
      "sign": "₽",
      "symbol": "RUB",
      "rate": 64.656361
    },
    "SAR": {
      "sign": "﷼",
      "symbol": "SAR",
      "rate": 3.750367
    },
    "SEK": {
      "sign": "kr",
      "symbol": "SEK",
      "rate": 9.47175
    },
    "SGD": {
      "sign": "$",
      "symbol": "SGD",
      "rate": 1.365989
    },
    "THB": {
      "sign": "฿",
      "symbol": "THB",
      "rate": 31.236406
    },
    "UAH": {
      "sign": "₴",
      "symbol": "UAH",
      "rate": 26.376671
    },
    "UYU": {
      "sign": "$U",
      "symbol": "UYU",
      "rate": 35.291519
    },
    "VND": {
      "sign": "₫",
      "symbol": "VND",
      "rate": 23375.438596
    },
    "ZAR": {
      "sign": "R",
      "symbol": "ZAR",
      "rate": 14.857072
    }
  },
  symbol: 'CNY'
}

export default handleActions({
  [actions.setCurrency] (state, action) {
    state.symbol = action.payload
  },
  [actions.updateCurrencyRates] (state, action) {
    const items = action.payload
    items.forEach(item => {
      if (state.list[item.symbol]) {
        state.list[item.symbol].rate = item.rate
      }
    })
  }
}, initialState)
