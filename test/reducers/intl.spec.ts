/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import reducer from 'reducers/intl'
import { setLocale } from 'actions/intl'
import { getInitialLang } from 'selectors/intl'
import * as walletActions from 'actions/wallet'

const initialState = getInitialLang()

describe('Intl Reducer', () => {
  it('should get initial state', () => {
    const state = reducer(undefined, {})
    expect(state).to.deep.equal(initialState)
  })

  it('should handle set locale', () => {
    const state = reducer(initialState, setLocale('zh'))
    expect(state).to.deep.equal({ locale: 'zh' })
  })

  it('should createAsyncActions', () => {
    // const actions = createAsyncActions('DELETE_WALLET')
    // console.log(actions)
    console.log(walletActions)
    expect(true).to.be.true
  })
})
