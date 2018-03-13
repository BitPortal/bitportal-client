/* @tsx */

import { Component } from 'react'

let titles: string[] = []

const getTitle = () => {
  return titles[titles.length - 1]
}

const updateTitle = () => {
  document.title = getTitle()
}

export const flushTitle = () => {
  const title = getTitle()
  titles = []
  return title
}

export interface Props {
  render: string
}

export interface State {
  index: number
}

export default class Title extends Component<Props, State> {
  constructor(props: Props, context: object) {
    super(props, context)
    this.state = { index: titles.push('') - 1 }
  }

  componentDidMount() {
    titles = titles.filter(n => n)
    this.setState({ index: titles.length - 1 })
  }

  componentWillUnmount() {
    if (this.state.index < titles.length - 1) {
      titles[this.state.index] = ''
    } else {
      titles.pop()
    }
  }

  componentDidUpdate() {
    updateTitle()
  }

  render() {
    const { render } = this.props
    titles[this.state.index] = render

    return null
  }
}
