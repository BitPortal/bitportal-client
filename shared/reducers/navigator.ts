import { Navigator } from 'navigators'

const initialState = null

const prevGetStateForActionHomeStack = Navigator.router.getStateForAction

Navigator.router.getStateForAction = (action, state) => {
  if (state && action.type === 'ReplaceCurrentScreen') {
    const routes = state.routes.slice(0, state.routes.length - 1)
    routes.push(action)
    return {
      ...state,
      routes,
      index: routes.length - 1,
    }
  }
  return prevGetStateForActionHomeStack(action, state);
}

const navigatorReducer = (state = initialState, action: any) => {
  const nextState = Navigator.router.getStateForAction(action, state)

  return nextState || state
}

export default navigatorReducer
