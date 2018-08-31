/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import reducer from 'reducers/intl'
import { setLocale } from 'actions/intl'
import { getInitialLang } from 'selectors/intl'

const initialState = getInitialLang()

describe('Intl Reducer', () => {
  it('should get initial state', () => {
    const state = reducer(undefined, {})
    expect(state.equals(initialState)).to.be.true
  })

  it('should handle set locale', () => {
    const state = reducer(initialState, setLocale('zh'))
    expect(state.get('locale')).to.equal('zh')
  })
})
