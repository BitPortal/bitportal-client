/* eslint-disable */

import React from 'react'
import PropTypes from 'prop-types'

class CollectionView extends React.Component {
  render() {
    // These items don't get rendered directly.
    return null
  }
}

CollectionView.propTypes = {
  reactModuleForHeader: PropTypes.string,
  reactModuleForFooter: PropTypes.string
}

export default CollectionView
