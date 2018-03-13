/* eslint-env mocha */

import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import Spinner from 'components/Spinner'
import style from 'components/Spinner/style.css'

describe('<Spinner /> ', () => {
  it('should render the Spinner with className \'spinner\'', () => {
    const wrapper = shallow(<Spinner />)
    expect(wrapper.find('div')).to.has.className(style.spinner)
  })
})
