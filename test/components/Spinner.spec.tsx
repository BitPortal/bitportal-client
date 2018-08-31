import React from 'react'
import { mount } from 'enzyme'
import { expect } from 'chai'
import Spinner from 'components/Spinner'
import style from 'components/Spinner/style.css'

describe('<Spinner />', () => {
  it(`should render the Spinner with className ${style.spinner}`, () => {
    const wrapper = mount(<Spinner />)
    expect(wrapper.find('[data-testid="spinner"]')).to.have.className(style.spinner)
  })
})
