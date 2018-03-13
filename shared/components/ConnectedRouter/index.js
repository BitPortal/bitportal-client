import { ConnectedRouter as _ConnectedRouter } from 'react-router-redux'
import PropTypes from 'prop-types'

export default class ConnectedRouter extends _ConnectedRouter {
  static childContextTypes = {
    router: PropTypes.object.isRequired
  }

  getChildContext() {
    return {
      router: {
        staticContext: this.props.context
      }
    }
  }
}
