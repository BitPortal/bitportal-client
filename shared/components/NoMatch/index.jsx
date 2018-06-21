import React from 'react'
import { Redirect } from 'react-router-dom'

const NoMatch = (props) => {
  if (props.staticContext) props.staticContext.url = '/'
  return (<Redirect to="/" />)
}

export default NoMatch
