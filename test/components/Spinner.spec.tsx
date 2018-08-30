import React from 'react'
import { render, cleanup } from 'react-testing-library'
import { expect } from 'chai'
import Spinner from 'components/Spinner'
import style from 'components/Spinner/style.css'

describe('<Spinner />', () => {
  afterEach(cleanup)

  it(`should render the Spinner with className ${style.spinner}`, () => {
    const { getByTestId } = render(<Spinner />)
    const spinner = getByTestId('spinner')
    expect(spinner.className).to.equal(style.spinner)
  })
})
