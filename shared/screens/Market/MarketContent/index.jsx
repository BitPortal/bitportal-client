import React, { Component } from 'react'
import Overview from 'screens/Market/Overview'
import Dexlize from 'screens/Market/Dexlize'
import SystemResources from 'screens/Market/SystemResources'

class MarketContent extends Component {
  render() {
    const { category } = this.props
    if (category === 'OVERVIEW') return <Overview componentId={this.props.componentId} />
    else if (category === 'DEXLIZE') return <Dexlize />
    else if (category === 'SYSTEM') return <SystemResources />
    else return null
  }
}

export default MarketContent
